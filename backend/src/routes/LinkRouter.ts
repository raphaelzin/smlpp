import express, { Request, Response } from "express";
import { AppDataSource } from "../database/data-source.js";
import { Link } from "../database/entity/Link.js";
import { Redirect } from "../database/entity/Redirect.js";
import { randomString } from "../util/util.js";
import { Logger } from "tslog";

const router = express.Router();
const logger = new Logger();

router.post("/create", async (req: Request, res: Response) => {
  const { short, url } = req.body;
  if (url == undefined) res.sendStatus(400);

  const repo = AppDataSource.getRepository(Link);
  const existingLink = await repo.findOneBy({ url: url });

  if (existingLink) {
    res.send(existingLink);
    return;
  }

  const existingShort = await repo.findOneBy({ short: short });
  if (existingShort != undefined) {
    res.send("Short already exists");
    return;
  }

  const link = new Link();
  link.url = url;
  link.short = short ?? "";

  try {
    if (short == undefined) {
      await repo.save(link);
      link.short = link.id + randomString(4);
    }
    await repo.save(link);
    res.send(link);
  } catch (e) {
    logger.error(e);
    res.sendStatus(500);
  }
});

const followLink = async (req: Request, res: Response) => {
  if (!req.params.shortId) {
    res.sendStatus(400);
  }

  const short = req.params.shortId;
  const repo = AppDataSource.getRepository(Link);
  try {
    const link = await repo.findOneByOrFail({
      short: short,
    });
    await createRedirectRecord(req.ip, link);
    res.redirect(link.url);
  } catch (e) {
    logger.error(e);
    res.sendStatus(404);
  }
};

const createRedirectRecord = async (ip: string, link: Link) => {
  const redirect = new Redirect();
  redirect.ip = ip;
  redirect.link = link;
  await AppDataSource.getRepository(Redirect).save(redirect);
};

export { followLink };
export { router as linkRouter };
