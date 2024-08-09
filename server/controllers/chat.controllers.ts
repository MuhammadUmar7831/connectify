import { NextFunction, Response } from "express";
import { authRequest } from "../middlewares/authenticate";
import connection from "../config/db";
import { QueryError, QueryResult, ResultSetHeader, RowDataPacket } from "mysql2";
import errorHandler from "../errors/error";
import {
  getGroupChatsQuery,
  getPersonalChatQuery,
} from "../utils/getChatQuries";
import chatHeaderDataQuery from '../utils/chatHeaderdataQuery';

export const createPersonalChat = async (
  req: authRequest,
  res: Response,
  next: NextFunction
) => {
  const { content, receiverId } = req.body;

  // if (receiverId === req.userId) {
  //     return next(errorHandler(400, 'You can not send a Message to Yourself'))
  // }

  // begin transaction in case of any error rollback else commit all four queries changes
  connection.beginTransaction((err: QueryError | null) => {
    // first create a new chat of type personal
    var sql = "INSERT INTO Chats (Type) VALUES ('Personal');";
    connection.query(sql, (err: QueryError | null, result: RowDataPacket) => {
      if (err) {
        return connection.rollback(() => next(err));
      }

      const chatId = result.insertId;
      // second create a message which referes to the chat created
      sql =
        "INSERT INTO Messages (ChatId, SenderId, Content) VALUES (?, ?, ?);";
      connection.query(
        sql,
        [chatId, req.userId, content],
        (err: QueryError | null, _result: QueryResult | any) => {
          if (err) {
            connection.rollback(() => next(err));
          }

          // third create a PersonalChat
          sql = "INSERT INTO PersonalChats (ChatId, MessageId) VALUES (?, ?);";
          connection.query(
            sql,
            [chatId, _result.insertId],
            (err: QueryError | null, result_: QueryResult) => {
              if (err) {
                return connection.rollback(() => next(err));
              }

              // fourth add 2 members to the chat
              sql =
                "INSERT INTO Members (UserId, ChatId) VALUES (?, ?), (?, ?);";
              connection.query(
                sql,
                [req.userId, chatId, receiverId, chatId],
                (err: QueryError | null, r_esult: QueryResult) => {
                  if (err) {
                    return connection.rollback(() => next(err));
                  }

                  // commit and return success response if no errors else rollback
                  connection.commit((err: QueryError | null) => {
                    if (err) {
                      return connection.rollback(() => next(err));
                    }

                    res
                      .status(201)
                      .send({
                        success: true,
                        message: "Personal Chat created",
                      });
                  });
                }
              );
            }
          );
        }
      );
    });
  });
};

export const archiveChat = async (
  req: authRequest,
  res: Response,
  next: NextFunction
) => {
  const { chatId } = req.body;

  // case to check if the passed chat is users chat or not
  var sql = "SELECT * FROM Chats c JOIN Members m ON c.ChatId = m.ChatId WHERE c.ChatId = ? AND m.UserId = ?;";
  connection.query(sql, [chatId, req.userId], (err: QueryError | null, result: RowDataPacket[]) => {
    if (err) {
      return next(err);
    }
    if (result.length === 0) {
      return next(errorHandler(400, "Forbidden! Not Allowed"));
    }
  }
  );

  // now insert the archived chat in ArchivedChats Table
  connection.beginTransaction((err: QueryError | null) => {
    sql = "INSERT INTO ArchivedChats (ChatId, UserId) VALUES (?, ?);";
    connection.query(sql, [chatId, req.userId], (err: QueryError | null, result: QueryResult) => {
      if (err) {
        return connection.rollback(() => next(err));
      }

      sql = "DELETE FROM PinnedChats WHERE ChatId = ? AND UserId = ?;";
      connection.query(sql, [chatId, req.userId], (err: QueryError | null, result: QueryResult) => {
        if (err) {
          return connection.rollback(() => next(err));
        }

        connection.commit((err: QueryError | null) => {
          if (err) {
            return connection.rollback(() => next(err));
          }
          return res.status(201).send({ success: true, message: "Chat Archived" });
        })
      })
    });
  })
};

export const unArchiveChat = async (req: authRequest, res: Response, next: NextFunction) => {
  const { chatId } = req.body;

  // Validate chatId
  if (typeof chatId !== 'number') {
    return next(errorHandler(400, "Invalid chatId format expected {chatId: number}"));
  }

  // Check if the chat belongs to the user
  let sql = "SELECT * FROM Chats c JOIN Members m ON c.ChatId = m.ChatId WHERE c.ChatId = ? AND m.UserId = ?;";
  connection.query(sql, [chatId, req.userId], (err: QueryError | null, result: RowDataPacket[]) => {
    if (err) {
      return next(err);
    }
    if (result.length === 0) {
      return next(errorHandler(404, "You are not Member of this Chat"));
    }

    // Remove chat from ArchivedChats table
    sql = "DELETE FROM ArchivedChats WHERE ChatId = ? AND UserId = ?;";
    connection.query(sql, [chatId, req.userId], (err: QueryError | null, result: ResultSetHeader) => {
      if (err) {
        return next(err);
      }

      // Check if any rows were affected
      if (result.affectedRows === 0) {
        return next(errorHandler(404, "Chat was not Archive"));
      }

      return res.status(200).send({ success: true, message: "Chat Un-Archived" });
    });
  }
  );
};

export const pinChat = async (req: authRequest, res: Response, next: NextFunction) => {
  const { chatId } = req.body;

  var query = "SELECT * FROM ArchivedChats WHERE ChatId = ? AND UserId = ?;";
  connection.query(query, [chatId, req.userId], (err: QueryError | null, result: RowDataPacket[]) => {
    if (err) { return next(err) }
    if (result.length > 0) {
      return next(errorHandler(400, 'Can not Pin an Archived Chat'));
    }

    query = "INSERT INTO PinnedChats (ChatId, UserId) VALUES (?,?);";
    connection.query(query, [chatId, req.userId], (err: QueryError | null, result: RowDataPacket[]) => {
      if (err) { return next(err) }

      return res.status(200).send({ success: true, message: "Chat Pinned" });
    })
  })
}

export const unPinChat = async (req: authRequest, res: Response, next: NextFunction) => {
  const { chatId } = req.body;

  var query = "DELETE FROM PinnedChats WHERE ChatId = ? AND UserId = ?;";
  connection.query(query, [chatId, req.userId], (err: QueryError | null, result: ResultSetHeader) => {
    if (err) { return next(err) }
    if (result.affectedRows === 0) {
      return next(errorHandler(404, 'This Chat is not Pinned'));
    }

    return res.status(200).send({ success: true, message: "Chat Un-Pinned" });
  })
}

// Negotiateable
// export const deleteChat = async (req: authRequest, res: Response, next: NextFunction) => {
//     const { chatId } = req.body;

//     var sql = 'SELECT * FROM Chats c JOIN Members m ON c.ChatId = m.ChatId WHERE c.ChatId = ? AND m.UserId = ?;';
//     connection.query(sql, [chatId, req.userId], (err: QueryError | null, result: RowDataPacket[]) => {
//         if (err) { return next(err) }
//         if (result.length === 0) { return next(errorHandler(400, 'Forbidden! Not Allowed')) }
//     })

//     sql = 'DELETE FROM Chats WHERE '
// }

export const getPersonalChats = async (req: authRequest, res: Response, next: NextFunction) => {
  const sql = `${getPersonalChatQuery}  AND
    c.ChatId NOT IN (
        select ChatId from PinnedChats Where UserId = m.UserId
    ) AND 
    c.ChatId NOT IN (
        SELECT ChatId FROM ArchivedChats WHERE UserId = m.UserId
    )
    ORDER BY TimeStamp DESC;`;
  connection.query(sql, [req.userId], (err: QueryError | null, result: RowDataPacket[]) => {
    if (err) {
      return next(err);
    }

    res.status(200).send({ success: true, message: "Personal Chats retrieved", data: result, });
  }
  );
};

export const getGroupChats = async (req: authRequest, res: Response, next: NextFunction) => {
  const sql = `${getGroupChatsQuery} AND
    g.ChatId NOT IN (
        select ChatId from PinnedChats Where UserId = m.UserId
    ) AND 
    g.ChatId NOT IN (
        SELECT ChatId FROM ArchivedChats WHERE UserId = m.UserId
    )
    ORDER BY TimeStamp DESC;`;
  connection.query(sql, [req.userId], (err: QueryError | null, result: RowDataPacket[]) => {
    if (err) {
      return next(err);
    }

    res.status(200).send({ success: true, message: "Group chats retrieved", data: result });
  }
  );
};

export const getArchivedChats = (req: authRequest, res: Response, next: NextFunction) => {
  const sqlQuery = `
        ${getPersonalChatQuery} AND
        c.ChatId IN (
            SELECT ChatId FROM ArchivedChats WHERE UserId = m.UserId
        )
        UNION
        ${getGroupChatsQuery}
        AND g.ChatId IN (
            SELECT ChatId FROM ArchivedChats WHERE UserId = m.UserId
        )
        ORDER BY TimeStamp DESC;`;

  connection.query(sqlQuery, new Array(2).fill(req.userId), (err: QueryError | null, result: RowDataPacket[]) => {
    if (err) {
      return next(err);
    }
    res.status(200).send({ success: true, message: "Archived chats retrieved successfully", data: result, });
  }
  );
};

export const getPinnedChats = (req: authRequest, res: Response, next: NextFunction) => {
  const sqlQuery = `
        ${getPersonalChatQuery} AND
        c.ChatId IN (
        SELECT ChatId FROM PinnedChats Where UserId = m.UserId
        ) AND 
        c.ChatId NOT IN (
            SELECT ChatId FROM ArchivedChats WHERE UserId = m.UserId
        )
        UNION
        ${getGroupChatsQuery}
        AND g.ChatId IN (
            select ChatId from PinnedChats Where UserId = m.UserId
        ) AND 
        g.ChatId NOT IN (
            SELECT ChatId FROM ArchivedChats WHERE UserId = m.UserId
        )
        ORDER BY TimeStamp DESC;`;

  connection.query(sqlQuery, new Array(2).fill(req.userId), (err: QueryError | null, result: RowDataPacket[]) => {
    if (err) {
      return next(err);
    }

    return res.status(200).send({ success: true, message: "Pinned chats retrieved successfully", data: result, });
  }
  );
};

export const getChatHeader = (req: authRequest, res: Response, next: NextFunction) => {
  const chatId = parseInt(req.query.chatId as string);

  connection.query(chatHeaderDataQuery, [req.userId, req.userId, req.userId, chatId, req.userId], (err: QueryError | null, chatHeaderData: RowDataPacket[]) => {
    if (err) { return next(err); }
    if (chatHeaderData.length === 0) {
      return next(errorHandler(404, 'Chat not Found'))
    }

    res.status(200).send({
      success: true,
      message: "Messages for Chat found",
      data: chatHeaderData[0]
    });
  })
}