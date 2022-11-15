import express, { Express } from "express";
import dotenv from "dotenv";

import { followLink, linkRouter } from "./routes/LinkRouter.js";
import * as url from "url";
const __dirname = url.fileURLToPath(new URL(".", import.meta.url));

dotenv.config({ path: __dirname + "/config/.env" });

const app: Express = express();
const port = process.env.PORT;
app.use(express.json());

app.get("/:shortId", followLink);
app.use("/link", linkRouter);

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});
