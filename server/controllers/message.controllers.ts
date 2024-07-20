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
  // selecting from view ChatMessages (for detail see lib/views.ChatMessages.sql)
  const query = `
      SELECT * FROM ChatMessages WHERE ChatId = ?;`;

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

export const sendMessage = async (
  req: authRequest,
  res: Response,
  next: NextFunction
) => {
  const { ChatId, Content, ReplyId } = req.body;

  // Transaction because of multiple inserts
  connection.beginTransaction((err: QueryError | null) => {
    // Create a new message and insert it (Trigger has been made to insert messageStatus for all users except sender)
    const insertMessageQuery =
      "INSERT INTO Messages (ChatId, Content, SenderId) VALUES (?,?,?)";
    connection.query(
      insertMessageQuery,
      [ChatId, Content, req.userId],
      (err: QueryError | null, result: RowDataPacket[]) => {
        if (err) {
          return connection.rollback(() => next(err));
        }
        // Trigger will be called to insert message statuses for all members except the sender (see lib/Triggers/TriggerAfterInsertMessages.sql)

        const messageId = result[0].insertId;

        // Check if it is a reply
        if (ReplyId) {
          // Trigger will be called before this to check if the replyId exists in the Chat
          connection.query(
            "INSERT INTO  Reply (ReplyId, MessageId) VALUES(?,?)",
            [ReplyId, messageId],
            (err: QueryError | null, result: RowDataPacket[]) => {
              if (err) {
                return connection.rollback(() => next(err));
              }

              // commiting transaction and sending response

              connection.commit((err: QueryError | null) => {
                if (err) {
                  return connection.rollback(() => next(err));
                }

                return res.status(200).send({
                  success: true,
                  message: "Message Sent",
                });
              });
            }
          );
        }
      }
    );
  });
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
