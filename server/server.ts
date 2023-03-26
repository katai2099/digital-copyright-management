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
export const client = create();
// initWeb3();

const app: Express = ExpressApp();
const port = 8082;

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
app.use("/submit", submitRouter);
app.get("/", (req: Request, res: Response) => {
  res.send("Express typescript server");
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
