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
    let chatId = req.params.chatId;

    // if it is not in params, then it should be in body for post request
    if (!chatId) {
      chatId = req.body.chatId;
    }

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
          next(errorHandler(403, "You are not a member of this chat"));
        }
        next();
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
  const { messageId } = req.body;

  const query = "SELECT TimeStamp FROM Messages WHERE Messages.MessageId = ?";
  // Checking if the message is being deleted within 5 minutes of sending
  connection.query(
    query,
    [messageId],
    (err: QueryError | null, result: RowDataPacket[]) => {
      if (err) {
        return next(err);
      }
      const messgeTimeStamp = result[0].TimeStamp;

      // converting into date object and calculating difference
      const messageDateObj = new Date(messgeTimeStamp);
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
  const { chatId, recieverId } = req.body;

  // if chatId has a value, than we do not need to do anything
  if (chatId !== false) {
    next();
  }

  // if chat id is false, we know that we have to create a new personal chat.
  // In case of group it will always have a value because group was created first.
  // (!ChatId) syntax has not been used because it will also give true for undefined.
  // Also explicitly mentioning the condition, instead of else case to handle any unintended value
  if (chatId === false) {
    connection.beginTransaction((err: QueryError | null) => {
      // Create new Personal chat
      const newChatQuery = "INSERT INTO Chats (Type) VALUES ('Personal')";
      connection.query(
        newChatQuery,
        (err: QueryError | null, result: RowDataPacket) => {
          if (err) {
            return connection.rollback(() => next(err));
          }
          req.body.ChatId = result.insertId;
          // Insert members into the new Personal Chat
          const addMembers =
            "INSERT INTO Members (UserId, ChatId) VALUES (?, ?), (?, ?);";
          connection.query(
            addMembers,
            [req.userId, chatId, recieverId, chatId],
            (err: QueryError | null, result: RowDataPacket[]) => {
              if (err) {
                return connection.rollback(() => next(err));
              }
              // commit and return success response if no errors else rollback
              connection.commit((err: QueryError | null) => {
                if (err) {
                  return connection.rollback(() => next(err));
                }

                next();
                // res
                //   .status(201)
                //   .send({ success: true, message: "Personal Chat created" });
              });
            }
          );
        }
      );
    });
  }
  next();
};

export {
  isChatMember,
  isMessageTimeFiveMinutes,
  createPersonalChatForFalseChatId,
};
