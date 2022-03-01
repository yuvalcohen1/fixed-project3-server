import { config } from "dotenv";
import mysql from "mysql2/promise";

config();

const { host, user, dbPassword, database, dbPort } = process.env;

export const db = mysql.createPool({
  host,
  port: Number(dbPort),
  user,
  password: dbPassword,
  database,
});
