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

export const sendMessage = async (
  req: authRequest,
  res: Response,
  next: NextFunction
) => {
  const { ChatId, Type } = req.body;
  let updatedChatId = ChatId;

  // if it is a personal chat, check if the chat has been previously created or not
  if (Type === "Personal" && !ChatId) {
    // Create new Personal chat
    const newChatQuery = "INSERT INTO Chats (Type) VALUES ('Personal')";
    connection.query(
      newChatQuery,
      (err: QueryError | null, result: RowDataPacket) => {
        if (err) {
          return next(err);
        }
        updatedChatId = result.insertId;
      }
    );
  }

  // Create a new message and insert it
  const { Content, SenderId } = req.body;
  const insertMessageQuery =
    "INSERT INTO Messages (ChatId, Content, SenderId) VALUES (?,?,?)";
  connection.query(
    insertMessageQuery,
    [updatedChatId, Content, SenderId],
    (err: QueryError | null, result: RowDataPacket[]) => {
      if (err) {
        return next(err);
      }
      const messageId = result[0].insertId;

      // Assigning query according to Chat Type
      let insertIntoChatQuery: string =
        Type === "Personal"
          ? "INSERT INTO PersonalChats (ChatId, MessageId) VALUES (?,?)"
          : "INSERT INTO GroupChats (ChatId, MessageId) VALUES (?,?)";

      // inserting into group or personal
      connection.query(
        insertIntoChatQuery,
        [ChatId, messageId],
        (err: QueryError | null, result: RowDataPacket[]) => {
          if (err) {
            return next(err);
          }
        }
      );

      // inserting into MessagesStatus Table
      connection.query(
        "INSERT INTO MessagesStatus (UserId, MessageId, Status) VALUES (?,?,'Sending')",
        [SenderId, messageId],
        (err: QueryError | null, result: RowDataPacket[]) => {
          if (err) {
            return next(err);
          }
        }
      );

      // Insert into reply table if it is a reply
      const { ReplyId } = req.body;
      if (ReplyId) {
        connection.query(
          "INSERT INTO  Reply (ReplyId, MessageId) VALUES(?,?)",
          [ReplyId, messageId],
          (err: QueryError | null, result: RowDataPacket[]) => {
            if (err) {
              return next(err);
            }
          }
        );
      }

      res.status(200).send({
        success: true,
        message: "Message Sent",
      });
    }
  );
};

export const deleteMessage = async (
  req: authRequest,
  res: Response,
  next: NextFunction
) => {};

export const editMessage = async (
  req: authRequest,
  res: Response,
  next: NextFunction
) => {};
