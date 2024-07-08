import { NextFunction, Request, Response } from "express";
import { QueryError, QueryResult, RowDataPacket } from "mysql2";
import connection from "../config/db";
import errorHandler from "../errors/error";

export const deleteGroup = async (req: Request, res: Response, next: NextFunction) => {
  const { userId, GroupId } = req.body;

  const query = `
    DELETE FROM Groups 
    WHERE GroupId = ? AND CreatedBy = (
      SELECT UserId 
      FROM GroupAdmins 
      WHERE UserId = ? AND GroupId = ?
    )`;
  const values: any = [GroupId, userId, GroupId];

  connection.query(query, values, (err: QueryError | null, result: RowDataPacket[]) => {
    if (err) {
      return next(err);
    }
    if (result.length === 0) {
        console.log("Error")
      return next(errorHandler(404, "Group not found or you do not have permission to delete it"));
    }
    res
      .status(200)
      .send({ success: true, message: 'Group Deleted' });
  });
};
