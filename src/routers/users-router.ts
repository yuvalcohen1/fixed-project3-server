import express, { Request, Response } from "express";
import bcrypt from "bcrypt";
import jsonwebtoken from "jsonwebtoken";
import { promisify } from "util";
import { config } from "dotenv";
import { RegisterBodyModel } from "../models/RegisterBody.model";
import {
  getUserById,
  getUserByUsername,
  insertUser,
} from "../DB/queries/users-queries";
import { verifyJwtMiddleware } from "../helpers/verifyJwtMiddleware";

config();

const { JWT_SECRET } = process.env;

const promisifiedSign = promisify(jsonwebtoken.sign);

export const usersRouter = express.Router();

usersRouter.post(
  "/register",
  async (req: Request<{}, {}, RegisterBodyModel>, res: Response) => {
    const { firstName, lastName, username, password } = req.body;
    if (!firstName || !lastName || !username || !password) {
      return res
        .status(400)
        .send("You have to send all registration body properties");
    }

    try {
      const user = await getUserByUsername(username);
      if (user) {
        return res.status(400).send("username are already exists");
      }

      const salt = await bcrypt.genSalt(2);
      const encryptedPassword = await bcrypt.hash(password, salt);

      const newUserId = await insertUser({
        firstName,
        lastName,
        username,
        encryptedPassword,
      });

      const newUser = await getUserById(newUserId);

      const jwt = await createJwt(firstName, lastName, username);

      res.cookie("token", jwt, { httpOnly: true, maxAge: 253370764800000 });
      res.send(newUser);
    } catch (error: any) {
      res.status(500).send(error.message);
    }
  }
);

usersRouter.post(
  "/login",
  async (
    req: Request<{}, {}, { username: string; password: string }>,
    res: Response
  ) => {
    const { username, password } = req.body;
    if (!username || !password) {
      return res
        .status(400)
        .send("You have to provide both username and password");
    }

    try {
      const user = await getUserByUsername(username);
      if (!user) {
        return res.status(401).send("Username and password don't match");
      }

      const isPasswordCorrect = await bcrypt.compare(
        password,
        user.encryptedPassword
      );
      if (!isPasswordCorrect) {
        res.status(401).send("Username and password don't match");
        return;
      }

      const jwt = await createJwt(
        user.firstName,
        user.lastName,
        username,
        user.isAdmin
      );

      res.cookie("token", jwt, { httpOnly: true, maxAge: 253370764800000 });
      res.send(user);
    } catch (error: any) {
      res.status(500).send(error.message);
    }
  }
);

usersRouter.post(
  "/delete-token-cookie",
  verifyJwtMiddleware,
  (req: Request, res: Response) => {
    res.clearCookie("token", { httpOnly: true, maxAge: 253370764800000 });
    res.end();
  }
);

async function createJwt(
  firstName: string,
  lastName: string,
  username: string,
  isAdmin: 0 | 1 = 0
) {
  return promisifiedSign(
    { firstName, lastName, username, isAdmin },
    JWT_SECRET!
  );
}
