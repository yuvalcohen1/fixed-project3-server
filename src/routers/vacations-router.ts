import { config } from "dotenv";
import express, { Request, Response } from "express";
import { getVacations } from "../DB/queries/vacations-queries";
import { verifyJwtMiddleware } from "../helpers/verifyJwtMiddleware";

config();

export const vacationsRouter = express.Router();

vacationsRouter.get(
  "/",
  verifyJwtMiddleware,
  async (req: Request, res: Response) => {
    try {
      const vacations = await getVacations();
      res.send(vacations);
    } catch (error: any) {
      res.status(500).send(error.message);
    }
  }
);
