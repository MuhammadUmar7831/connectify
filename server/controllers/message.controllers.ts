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
  const query = `SELECT * FROM ChatMessages WHERE ChatId = ?;`;

  connection.query(
    query,
    [req.params.ChatId, req.userId],
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
    // Create a new message and insert it
    const insertMessageQuery =
      "INSERT INTO Messages (ChatId, Content, SenderId) VALUES (?,?,?)";
    connection.query(
      insertMessageQuery,
      [ChatId, Content, req.userId],
      (err: QueryError | null, result: any) => {
        if (err) {
          connection.rollback(() => next(err));
        }
        // Trigger will be called to insert message statuses for all members except the sender (see lib/Triggers/TriggerAfterInsertMessages.sql)
        
        // if it is a reply then insert it
        else if (ReplyId){
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
                });
              });

            }
          );
        }
        // commit and return the response without reply
        else{
          connection.commit((err: QueryError | null) => {
            if (err) {
              return connection.rollback(() => next(err));
            }
            return res.status(201).send({
              success: true,
              message: "Message Sent",
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
  const { messageId } = req.body;

  const deleteQuery = "DELETE FROM Messages WHERE MessageId = ?";

  connection.query(
    deleteQuery,
    [messageId],
    (err: QueryError | null, result: RowDataPacket[]) => {
      if (err) {
        return next(err);
      }

      // if no rows were affected (possibly invalid message id)
      if (result[0].affectedRows) {
        return res.status(500).send({
          success: true,
          message: "Message Not Found, Invalid Message Id",
        });
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
  const { messageId, content } = req.body;

  const updateQuery = "UPDATE Messages SET Content = ? WHERE MessageId = ?";

  connection.query(
    updateQuery,
    [content, messageId],
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
