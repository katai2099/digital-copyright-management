import ExpressApp, { Express, Request, Response } from "express";
import { hashingRouter } from "./routers/hashing";
import { authRouter } from "./routers/auth";
import bodyParser from "body-parser";
import { create } from "ipfs-http-client";
import cors from "cors";
import { initWeb3 } from "./controllers/web3";
import { submitRouter } from "./routers/submit";
import { userRouter } from "./routers/users";
import { contentRouter } from "./routers/content";
import axios from "axios";
import {
  CRYPTO_COMPARE_API_KEY,
  CRYPTO_COMPARE_API_URL,
  IConversionRate,
} from "./models/common";
import { eventRouter } from "./routers/event";
import { agreementRouter } from "./routers/agreement";
import { searchRouter } from "./routers/search";
export const client = create();
var CronJob = require("cron").CronJob;

initWeb3();

const app: Express = ExpressApp();
const port = 8082;

let ethToUsd = 1749;
let usdToEth = 0.0054;

async function getFirstEtherPrice() {
  const res = await axios.get(
    `${CRYPTO_COMPARE_API_URL}/data/price?fsym=ETH&tsyms=USD&apikey=${CRYPTO_COMPARE_API_KEY}`
  );
  ethToUsd = res.data.USD;
  console.log("first ether price call");
  console.log(ethToUsd);
}

async function getFirstUsdtoEth() {
  const res = await axios.get(
    `${CRYPTO_COMPARE_API_URL}/data/price?fsym=USD&tsyms=ETH&apikey=${CRYPTO_COMPARE_API_KEY}`
  );
  usdToEth = res.data.ETH;
  console.log("first usd price call");
  console.log(usdToEth);
}

getFirstEtherPrice();
getFirstUsdtoEth();

var job = new CronJob("0 */5 * * * *", async function () {
  const date = new Date();
  const eth = await axios.get(
    `${CRYPTO_COMPARE_API_URL}/data/price?fsym=ETH&tsyms=USD&apikey=${CRYPTO_COMPARE_API_KEY}`
  );
  const usd = await axios.get(
    `${CRYPTO_COMPARE_API_URL}/data/price?fsym=USD&tsyms=ETH&apikey=${CRYPTO_COMPARE_API_KEY}`
  );
  ethToUsd = eth.data.USD;
  usdToEth = usd.data.ETH;
  console.log(`${date.toString()} 1eth : ${ethToUsd}$`);
  console.log(`${date.toString()} 1$ : ${usdToEth}eth`);
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
app.use("/auth", authRouter);
app.use("/contents", contentRouter);
app.use("/submit", submitRouter);
app.use("/events", eventRouter);
app.use("/agreements", agreementRouter);
app.use("/search", searchRouter);
app.get("/", (req: Request, res: Response) => {
  res.send("Express typescript server");
});

app.get("/coinPrice", (req: Request, res: Response) => {
  const rate = { ETHToUSD: ethToUsd, USDToETH: usdToEth } as IConversionRate;
  res.send(rate);
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
