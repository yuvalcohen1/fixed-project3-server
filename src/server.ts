import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { config } from "dotenv";
import { usersRouter } from "./routers/users-router";

config();
const { PORT } = process.env;
const app = express();

app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
app.use(express.json());
app.use(cookieParser());

app.use("/users", usersRouter);

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
