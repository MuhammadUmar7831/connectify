import { NextFunction, Response } from "express";
import { authRequest } from "../middlewares/authenticate";
import connection from "../config/db";
import { QueryError, RowDataPacket } from "mysql2";
import errorHandler from "../errors/error";

export const getMessageOfChats = async (req: authRequest, res: Response, next: NextFunction) => {
  const chatId = parseInt(req.query.chatId as string);
  const limit = parseInt(req.query.limit as string);
  const skip = parseInt(req.query.skip as string);

  //   Query to get Chat Messages based on ChatId with message status
  // selecting from view ChatMessages (for detail see lib/views/ChatMessages.sql)
  var query = `SELECT * FROM ChatMessages WHERE ChatId = ? ORDER BY Timestamp DESC LIMIT ? OFFSET ?;`;

  connection.query(query, [chatId, limit, skip], (err: QueryError | null, result: RowDataPacket[]) => {
    if (err) {
      return next(err);
    }

    res.status(200).send({
      success: true,
      message: "Messages for Chat found",
      data: result
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
    // Create a new message and insert it
    const insertMessageQuery =
      "INSERT INTO Messages (ChatId, Content, SenderId, Timestamp) VALUES (?,?,?,?)";

    let currentTime = new Date();

    connection.query(
      insertMessageQuery,
      [ChatId, Content, req.userId, currentTime],
      (err: QueryError | null, result: any) => {
        if (err) {
          connection.rollback(() => next(err));
        }
        // Trigger will be called to insert message statuses for all members except the sender (see lib/Triggers/TriggerAfterInsertMessages.sql)

        // if it is a reply then insert it
        else if (ReplyId) {
          const messageId = result.insertId;
          // Trigger will be called before this to check if the replyId exists in the Chat (see lib/Triggers/PreventOtherChatReply.sql)
          connection.query(
            "INSERT INTO  Reply (ReplyId, MessageId) VALUES(?,?)",
            [ReplyId, messageId],
            (err: QueryError | null, result: RowDataPacket[]) => {
              if (err) {
                return connection.rollback(() => next(err));
              }
              // commit and return the response with reply
              connection.commit((err: QueryError | null) => {
                if (err) {
                  return connection.rollback(() => next(err));
                }
                return res.status(201).send({
                  success: true,
                  message: "Message Sent with a reply",
                  data: {
                    MessageId: messageId,
                    ChatId,
                    Timestamp: currentTime,
                  },
                });
              });
            }
          );
        }
        // commit and return the response without reply
        else {
          const messageId = result.insertId;
          connection.commit((err: QueryError | null) => {
            if (err) {
              return connection.rollback(() => next(err));
            }
            return res.status(201).send({
              success: true,
              message: "Message Sent",
              data: {
                MessageId: messageId,
                ChatId,
                Timestamp: currentTime,
              },
            });
          });
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
  const { MessageId } = req.body;

  const deleteQuery = "DELETE FROM Messages WHERE MessageId = ?";

  connection.query(
    deleteQuery,
    [MessageId],
    (err: QueryError | null, result: any) => {
      if (err) {
        return next(err);
      }

      // if no rows were affected (possibly invalid message id)
      if (result.affectedRows === 0) {
        return next(errorHandler(500, "Message Not Found, Invalid Message Id"));
      }

      return res.status(200).send({
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
  const { MessageId, Content } = req.body;

  const updateQuery = "UPDATE Messages SET Content = ? WHERE MessageId = ?";

  connection.query(
    updateQuery,
    [Content, MessageId],
    (err: QueryError | null, result: RowDataPacket[]) => {
      if (err) {
        return next(err);
      }
      // Trigger will be called to insert message statuses for all members except the sender (see lib/Triggers/TriggerAfterUpdateMessages.sql)

      return res.status(200).send({
        success: true,
        message: "Message Updated",
      });
    }
  );
};
