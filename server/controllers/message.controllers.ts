import { NextFunction, Response } from "express";
import { authRequest } from "../middlewares/authenticate";
import connection from "../config/db";
import { QueryError, RowDataPacket } from "mysql2";

export const getMessageOfChats = async (
  req: authRequest,
  res: Response,
  next: NextFunction
) => {
  //   Query to get Chat Messages based on ChatId with message status
  //const query =
  //  "SELECT * FROM Messages JOIN MessagesStatus ON MessagesStatus.MessageId = Messages.MessageId LEFT JOIN Reply ON Messages.MessageId = Reply.MessageId WHERE ChatId = ? AND MessagesStatus.SenderId = ?";
  // selecting from view ChatMessages (for detail see lib/views.ChatMessages.sql)
  const query = `
      SELECT * FROM ChatMessages WHERE ChatId = ?;`

  // After joining messagestatus according to sender id we get unique status for each user
  // With Left join, every message will have ReplyId column, if it is a reply of some message, the ReplyId will not be null, ReplyId will be the message which was replied to by the message with MessageId

  connection.query(
    query,
    [req.params.chatId, req.userId],
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

// CHANGE: Warning! use connection.beginTransaction for more than one insert and rollback in case of error 
// CHANGE: or commit on success of all quries
export const sendMessage = async (
  req: authRequest,
  res: Response,
  next: NextFunction
) => {
  // CHANGE: get the Type from ChatId (use Chats Table) do not pass it in body (there is a fair chance that i pass group chat id and type personal)
  const { ChatId, Type, Content, SenderId, ReplyId } = req.body;
  let updatedChatId = ChatId;

  // CHANGE: in case chatId is not passed you have to create a new personal chat so you will have to add in members
  // CHANGE: table for that personal chat

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

      // CHANGE: message status is not saved for user who sent it (but for all other users who are members of that chat)
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

      // CHANGE: handle case where user gives invalid messageId in that case the 
      // CHANGE: result.rowsAffected (or something) like this will be 0 (no need for separate select query)

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
      // CHANGE: also update the status of that message for all users to sent 
      // CHANGE: whatsapp also do this


      res.status(200).send({
        success: true,
        message: "Message Updated",
      });
    }
  );
};
