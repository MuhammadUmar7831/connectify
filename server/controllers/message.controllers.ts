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

  // Every Member in the chat has it's own Message Status
  // There are two types of chat 1 Personal 2 Group
  // For Personal Chat the Overall Message Status is the Status of Message for the other Member
  // For Group Chat the Overall Status is Seen if all Members have seen message (Note every member status is also returned separately)
  // Most important message status is not saved for the user who sent the message
  // On Whatsapp we also see the name of the person who sent the message (also pass his id so if we click on his name we get redirected to his profile)
  // Also there is logic missing to get replies (think of frontend view how we can know this message is reply of which message)

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
      // let insertIntoChatQuery: string =
      //   Type === "Personal"
      //     ? "INSERT INTO PersonalChats (ChatId, MessageId) VALUES (?,?)"
      //     : "INSERT INTO GroupChats (ChatId, MessageId) VALUES (?,?)";
      let insertIntoChatQuery: string = `INSERT INTO ${Type}Chats (ChatId, MessageId) VALUES (?,?)`;

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

      // sending is not a status
      // here save sent status for each member in the group
      // the status will be changed to received and seen by sokect io

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
) => { };

export const editMessage = async (
  req: authRequest,
  res: Response,
  next: NextFunction
) => { };
