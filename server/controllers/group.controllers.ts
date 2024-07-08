import { NextFunction, Request, Response } from "express";
import { QueryError, QueryResult, RowDataPacket} from "mysql2";
import connection from "../config/db";
import errorHandler from "../errors/error";
import { authRequest } from "../middlewares/authenticate";

export const deleteGroup = async (req: authRequest, res: Response, next: NextFunction) => {
  const groupId = req.body;
  const query = `DELETE FROM _Groups WHERE GroupId = ?;`;
  const values: any = [groupId];

  connection.query(query, values, (err: QueryError | null, result: any) => {
    if (err) {
      return next(err);
    }
    res
      .status(200)
      .send({ success: true, message: 'Group Deleted' });
  });
};
