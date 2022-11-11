import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { followLink, LinkRouter } from "./routes/LinkRouter";

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

app.get("/:shortId", followLink);
app.use("/link", LinkRouter);

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});
