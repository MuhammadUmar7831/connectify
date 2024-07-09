import { NextFunction, Response } from "express";
import { authRequest } from "../middlewares/authenticate";
import connection from "../config/db";
import { QueryError, RowDataPacket } from "mysql2";

export const getMessageOfChats = async (
  req: authRequest,
  res: Response,
  next: NextFunction
) => {
  const chatId = req.params.chatId;

  //   Query to get Chat Messages based on ChatId with message status
  const query =
    "SELECT * FROM Messages JOIN MessagesStatus ON MessagesStatus.MessageId = Messages.MessageId WHERE ChatId = ?";
  connection.query(
    query,
    [chatId],
    (err: QueryError | null, result: RowDataPacket[]) => {
      if (err) {
        return next(err);
      }
      res.status(200).send({
        success: true,
        message: "Messages for Chat found",
        data: result,
      });
    }
  );
};
