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
    let ChatId = req.params.ChatId;


    // if it is not in params, then it should be in body for post request
    if (!ChatId) {
      ChatId = req.body.ChatId;
    }
    if (!ChatId) {
      ChatId = req.query.chatId as string
    }
    const receiverId = req.body.receiverId;
    if (typeof receiverId !== 'undefined') // for send message if recieverId is available in body it means that chat is new so no need to check for member
      return next();

    const query: string =
      "SELECT * FROM Members WHERE ChatId = ? AND UserId = ?";
    connection.query(
      query,
      [ChatId, userId],
      (err: QueryError | null, result: RowDataPacket[]) => {
        if (err) {
          return next(err);
        }

        if (result.length === 0) {
          next(errorHandler(403, "You are not a member of this chat"));
        }
        return next();
      }
    );
  } catch (error) {
    next(error);
  }
};

const isMessageTimeFiveMinutes = async (
  req: authRequest,
  res: Response,
  next: NextFunction
) => {
  const { MessageId } = req.body;
  const query = "SELECT Timestamp FROM Messages WHERE Messages.MessageId = ?";
  // Checking if the message is being deleted/edited within 5 minutes of sending
  connection.query(
    query,
    [MessageId],
    (err: QueryError | null, result: RowDataPacket[]) => {
      if (err) {
        return next(err);
      }
      const messageTimeStamp = result[0].Timestamp;

      // converting into date object and calculating difference
      const messageDateObj = new Date(messageTimeStamp);
      const currentTimeStamp = new Date();
      const difference = currentTimeStamp.getTime() - messageDateObj.getTime();
      const differenceInMinutes = Math.floor(difference / 1000 / 60);

      if (differenceInMinutes >= 5) {
        next(errorHandler(403, "More than 5 minutes passed for the message"));
      }

      next();
    }
  );
};

const createPersonalChatForFalseChatId = async (
  req: authRequest,
  res: Response,
  next: NextFunction
) => {
  const { ChatId, receiverId } = req.body;

  if (ChatId !== false) {
    return next();
  }

  if (ChatId === false) {
    connection.beginTransaction((err: QueryError | null) => {
      if (err) {
        return next(err);
      }

      // Create new Personal chat
      const newChatQuery = "INSERT INTO Chats (Type) VALUES ('Personal')";
      connection.query(
        newChatQuery,
        (err: QueryError | null, result: RowDataPacket) => {
          if (err) {
            return connection.rollback(() => next(err));
          }

          const newChatId = result.insertId; // Store the newly created ChatId
          req.body.ChatId = newChatId;

          // Insert members into the new Personal Chat
          const addMembers =
            "INSERT INTO Members (UserId, ChatId) VALUES (?, ?), (?, ?);";
          connection.query(
            addMembers,
            [req.userId, newChatId, receiverId, newChatId],
            (err: QueryError | null) => {
              if (err) {
                return connection.rollback(() => next(err));
              }

              // Commit and return success response if no errors else rollback
              connection.commit((err: QueryError | null) => {
                if (err) {
                  return connection.rollback(() => next(err));
                }
                next();
              });
            }
          );
        }
      );
    });
  }
};


export {
  isChatMember,
  isMessageTimeFiveMinutes,
  createPersonalChatForFalseChatId,
};
