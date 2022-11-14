import express, { Request, Response } from "express";
import { AppDataSource } from "../database/data-source";
import { Link } from "../database/entity/Link";

const router = express.Router();

router.post("/create", async (req: Request, res: Response) => {
  const { short, url } = req.body;
  if (short == undefined || url == undefined) {
    res.sendStatus(400);
  }

  const link = new Link();
  link.redirect_count = 0;
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

  const r = AppDataSource.createQueryRunner();
  const count = await r.query(
    `SELECT COUNT(*) FROM redirect WHERE link_id = ${1};`
  );
  console.log(count[0].count);

  const short = req.params.shortId;
  const repo = AppDataSource.getRepository(Link);

  try {
    const link = await repo.findOneByOrFail({
      short: short,
    });
    console.log(link);
    link.redirect_count += 1;
    repo.save(link);
    res.redirect(link.url);
  } catch (e) {
    res.sendStatus(404);
  }
};

export { followLink };
export { router as linkRouter };
