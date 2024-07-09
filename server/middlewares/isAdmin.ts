import connection from "../config/db";
import { Request, Response, NextFunction } from "express";
import { authRequest } from "./authenticate";
import errorHandler from "../errors/error";
import { QueryError, RowDataPacket } from "mysql2";


const isAdmin = async (req: authRequest, res: Response, next: NextFunction) => {
  try {
    // const groupId = req.body
    const { groupId } = req.body

    // const query: string = 'SELECT UserId FROM Users WHERE UserId IN (SELECT UserId FROM GroupAdmins WHERE UserId = ? AND GroupId = ?);';
    const query: string = 'SELECT UserId FROM GroupAdmins WHERE UserId = ? AND GroupId = ?;';
    connection.query(query, [req.userId, groupId], (err: QueryError | null, result: RowDataPacket[]) => {
      if (err) {
        return next(err)
      }

      if (result.length === 0) {
        return next(errorHandler(403, "Access Denied"))
      }
      next()
    })
  }
  catch (error) {
    next(error)
  }
}

export default isAdmin