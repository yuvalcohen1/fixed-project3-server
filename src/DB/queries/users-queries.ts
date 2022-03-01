import { RowDataPacket } from "mysql2";
import { UserModel } from "../../models/User.model";
import { db } from "../db";

type DbQueryResult<TableRecord> = (TableRecord & RowDataPacket)[];

export async function getUserByUsername(
  username: string
): Promise<UserModel | undefined> {
  const [[user]] = await db.query<DbQueryResult<UserModel>>(
    "SELECT * FROM users WHERE username = ?",
    [username]
  );

  return user;
}

export async function getUserById(
  userId: number
): Promise<UserModel | undefined> {
  const [[user]] = await db.query<DbQueryResult<UserModel>>(
    "SELECT * FROM users WHERE id = ?",
    [userId]
  );

  return user;
}

export async function insertUser({
  firstName,
  lastName,
  username,
  encryptedPassword,
}: Partial<UserModel>): Promise<number> {
  const [{ insertId }] = await db.query<any>(
    "INSERT INTO users (firstName, lastName, username, encryptedPassword) VALUES (?, ?, ?, ?)",
    [firstName, lastName, username, encryptedPassword]
  );

  return insertId as number;
}
