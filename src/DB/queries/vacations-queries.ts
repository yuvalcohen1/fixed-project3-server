import { RowDataPacket } from "mysql2";
import { VacationModel } from "../../models/Vacation.model";
import { db } from "../db";

type DbQueryResult<TableRecord> = (TableRecord & RowDataPacket)[];

export async function getVacations(): Promise<VacationModel[]> {
  const [vacations] = await db.query<DbQueryResult<VacationModel>>(
    "SELECT * FROM vacations",
    []
  );

  return vacations;
}
