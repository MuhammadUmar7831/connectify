import { NextFunction, Request, Response } from "express";
import { QueryError, QueryResult, RowDataPacket, ResultSetHeader} from "mysql2";
import connection from "../config/db";
import errorHandler from "../errors/error";
import { authRequest } from "../middlewares/authenticate";

export const deleteGroup = async (req: authRequest, res: Response, next: NextFunction) => {
  const {GroupId } = req.body;
  const query = `DELETE FROM _Groups  WHERE GroupId = ?;`;
  const values: any = [GroupId];

  connection.query(query, values, (err: QueryError | null, result: ResultSetHeader) => {
    if (err) {
      return next(err);
    }
    if (result.affectedRows === 0) {
        console.log("Error")
      return next(errorHandler(404, "Group not found or you do not have permission to delete it"));
    }
    res
      .status(200)
      .send({ success: true, message: 'Group Deleted' });
  });
};
