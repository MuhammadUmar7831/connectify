import { NextFunction, Response } from "express";
import { authRequest } from "./authenticate";
import connection from "../config/db";
import { QueryError, RowDataPacket } from "mysql2";
import errorHandler from "../errors/error";

// Middle Ware that will be called to verify the that the user is a member of the chat
const isChatMember = async (
  req: authRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.userId;
    const chatId = req.params.chatId;
    const query: string =
      "SELECT * FROM Members WHERE ChatId = ? AND UserId = ?";
    connection.query(
      query,
      [chatId, userId],
      (err: QueryError | null, result: RowDataPacket[]) => {
        if (err) {
          return next(err);
        }

        if (result.length === 0) {
          next(errorHandler(403, "Access Denied"));
        }
        next();
      }
    );
  } catch (error) {
    next(error);
  }
};

export default isChatMember;
