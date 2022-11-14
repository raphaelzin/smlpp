import express, { Request, Response } from "express";
import { AppDataSource } from "../database/data-source";
import { Link } from "../database/entity/Link";
import { Redirect } from "../database/entity/Redirect";

const router = express.Router();

router.post("/create", async (req: Request, res: Response) => {
  const { short, url } = req.body;
  if (short == undefined || url == undefined) {
    res.sendStatus(400);
  }

  const link = new Link();
  link.short = short;
  link.url = url;

  try {
    await AppDataSource.manager.save(link);
    res.send(link);
  } catch (e) {
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
    console.log(e);
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
