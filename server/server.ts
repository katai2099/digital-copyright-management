import ExpressApp, { Express, Request, Response } from "express";
import { hashingRouter } from "./routers/hashing";
import { ipfsRouter } from "./routers/ipfs";
import { authRouter } from "./routers/auth";
import bodyParser from "body-parser";
import { create } from "ipfs-http-client";
import cors from "cors";
import { nodeRouter } from "./routers/blockchain";
import { initWeb3 } from "./controllers/web3";
import { submitRouter } from "./routers/submit";
import { userRouter } from "./routers/users";
import { contentRouter } from "./routers/content";
import axios from "axios";
export const client = create();
var CronJob = require("cron").CronJob;

initWeb3();

const app: Express = ExpressApp();
const port = 8082;

let etherPrice = 0;

async function getFirstEtherPrice() {
  const res = await axios.get(
    "https://api.etherscan.io/api?module=stats&action=ethprice&apikey=9ZRCY23TJ6WFRBKDI9VFTHST4J7H89NFBY"
  );
  etherPrice = res.data.result.ethusd;
  console.log("first ether price call");
  console.log(etherPrice);
}

getFirstEtherPrice();

var job = new CronJob("0 */5 * * * *", async function () {
  const date = new Date();
  const res = await axios.get(
    "https://api.etherscan.io/api?module=stats&action=ethprice&apikey=9ZRCY23TJ6WFRBKDI9VFTHST4J7H89NFBY"
  );
  etherPrice = res.data.result.ethusd;
  console.log(`${date.toString()} price: ${etherPrice}`);
});

job.start();

app.use(bodyParser({ limit: "10mb" }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "*",
    methods: ["POST", "GET", "PUT"],
    allowedHeaders: ["Content-Type"],
  })
);
app.use("/auth", authRouter);
app.use("/users", userRouter);
app.use("/hash", hashingRouter);
app.use("/ipfs", ipfsRouter);
app.use("/auth", authRouter);
app.use("/web3", nodeRouter);
app.use("/contents", contentRouter);
app.use("/submit", submitRouter);
app.get("/", (req: Request, res: Response) => {
  res.send("Express typescript server");
});

app.get("/coin", (req: Request, res: Response) => {
  res.send(etherPrice);
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
