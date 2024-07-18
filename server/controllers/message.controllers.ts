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
  const userId = req.userId; // id of the logged in user after authentication, so that we can get the message status according to the logged in user

  //   Query to get Chat Messages based on ChatId with message status
  const query =
    "SELECT * FROM Messages JOIN MessagesStatus ON MessagesStatus.MessageId = Messages.MessageId LEFT JOIN Reply ON Messages.MessageId = Reply.MessageId WHERE ChatId = ? AND MessagesStatus.SenderId = ?";

  // After joining messagestatus according to sender id we get unique status for each user
  // With Left join, every message will have ReplyId column, if it is a reply of some message, the ReplyId will not be null, ReplyId will be the message which was replied to by the message with MessageId

  connection.query(
    query,
    [chatId, userId],
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
  const { ChatId, Type, Content, SenderId, ReplyId } = req.body;
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

      // TABLES HAVE BEEN DROPPED
      // let insertIntoChatQuery: string = `INSERT INTO ${Type}Chats (ChatId, MessageId) VALUES (?,?)`;

      // // inserting into group or personal
      // connection.query(
      //   insertIntoChatQuery,
      //   [ChatId, messageId],
      //   (err: QueryError | null, result: RowDataPacket[]) => {
      //     if (err) {
      //       return next(err);
      //     }
      //   }
      // );

      // sending is not a status
      // here save sent status for each member in the group
      // the status will be changed to received and seen by sokect io

      // inserting into MessagesStatus Table
      connection.query(
        "INSERT INTO MessagesStatus (UserId, MessageId, Status) VALUES (?,?,'sent')",
        [SenderId, messageId],
        (err: QueryError | null, result: RowDataPacket[]) => {
          if (err) {
            return next(err);
          }
        }
      );

      // Insert into reply table if it is a reply
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
) => {
  const { messageId } = req.body;

  const deleteQuery = "DELETE FROM Messages WHERE MessageId = ?";

  connection.query(
    deleteQuery,
    [messageId],
    (err: QueryError | null, result: RowDataPacket[]) => {
      if (err) {
        return next(err);
      }

      res.status(200).send({
        success: true,
        message: "Message Deleted",
      });
    }
  );
};

export const editMessage = async (
  req: authRequest,
  res: Response,
  next: NextFunction
) => {
  const { messageId, content } = req.body;

  const updateQuery = "UPDATE Messages SET Content = ? WHERE MessageId = ?";

  connection.query(
    updateQuery,
    [content, messageId],
    (err: QueryError | null, result: RowDataPacket[]) => {
      if (err) {
        return next(err);
      }

      res.status(200).send({
        success: true,
        message: "Message Updated",
      });
    }
  );
};
