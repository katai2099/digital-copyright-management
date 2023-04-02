import { Request, Response, Router } from "express";
import { getUsersBySearchTerm } from "../database/user";
import { getContentBySearchTerm } from "../database/content";
import { toJSON } from "../utils/utils";

export const searchRouter = Router();

searchRouter.get("/", async (req: Request, res: Response) => {
  const { query } = req.query;
  if (!query) {
    return res.status(400).send("Search term is missing");
  }
  try {
    const users = await getUsersBySearchTerm(query as string);
    const contents = await getContentBySearchTerm(query as string);
    return res
      .status(200)
      .send({ users: toJSON(users), contents: toJSON(contents) });
  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal Server Error");
  }
});
