import { NextFunction, Response } from "express";
import { authRequest } from "../middlewares/authenticate";
import connection from "../config/db";
import { QueryError, QueryResult, RowDataPacket } from "mysql2";
import errorHandler from "../errors/error";

export const createPersonalChat = async (req: authRequest, res: Response, next: NextFunction) => {
    const { content, receiverId } = req.body;

    // if (receiverId === req.userId) {
    //     return next(errorHandler(400, 'You can not send a Message to Yourself'))
    // }

    // begin transaction in case of any error rollback else commit all four queries changes
    connection.beginTransaction((err: QueryError | null) => {

        // first create a new chat of type personal 
        var sql = "INSERT INTO Chats (Type) VALUES ('Personal');";
        connection.query(sql, (err: QueryError | null, result: RowDataPacket) => {
            if (err) { return connection.rollback(() => next(err)) }

            const chatId = result.insertId;
            // second create a message which referes to the chat created
            sql = 'INSERT INTO Messages (ChatId, SenderId, Content) VALUES (?, ?, ?);';
            connection.query(sql, [chatId, req.userId, content], (err: QueryError | null, _result: QueryResult | any) => {
                if (err) { connection.rollback(() => next(err)) }

                // third create a PersonalChat
                sql = 'INSERT INTO PersonalChats (ChatId, MessageId) VALUES (?, ?);';
                connection.query(sql, [chatId, _result.insertId], (err: QueryError | null, result_: QueryResult) => {
                    if (err) { return connection.rollback(() => next(err)) }

                    // fourth add 2 members to the chat
                    sql = 'INSERT INTO Members (UserId, ChatId) VALUES (?, ?), (?, ?);';
                    connection.query(sql, [req.userId, chatId, receiverId, chatId], (err: QueryError | null, r_esult: QueryResult) => {
                        if (err) { return connection.rollback(() => next(err)) }

                        // commit and return success response if no errors else rollback
                        connection.commit((err: QueryError | null) => {
                            if (err) { return connection.rollback(() => next(err)) }

                            res.status(201).send({ success: true, message: 'Personal Chat created' });
                        })
                    })
                })
            })
        })
    })
}


export const archiveChat = async (req: authRequest, res: Response, next: NextFunction) => {
    const { chatId } = req.body;

    // case to check if the passed chat is users chat or not
    var sql = 'SELECT * FROM Chats c JOIN Members m ON c.ChatId = m.ChatId WHERE c.ChatId = ? AND m.UserId = ?;';
    connection.query(sql, [chatId, req.userId], (err: QueryError | null, result: RowDataPacket[]) => {
        if (err) { return next(err) }
        if (result.length === 0) {
            return next(errorHandler(400, 'Forbidden! Not Allowed'));
        }
    })

    // now insert the archived chat in ArchivedChats Table
    sql = 'INSERT INTO ArchivedChats (ChatId, UserId) VALUES (?, ?);';
    connection.query(sql, [chatId, req.userId], (err: QueryError | null, result: QueryResult) => {
        if (err) { return next(err) }
        res.status(201).send({ success: true, message: 'Chat Archived' })
    })
}








export const getPersonalChats = async (req: authRequest, res: Response, next: NextFunction) => {
    const userId = req.body.userId; // set by the authenticate middleware
  
    const sqlQuery = `
        SELECT DISTINCT m.ChatId 
        FROM Members m 
        INNER JOIN PersonalChats pc ON pc.ChatId = m.ChatId 
        WHERE m.UserId = ?
    `;

    connection.query(sqlQuery, [userId], (err: QueryError | null, results: RowDataPacket[]) => {
        if (err) {
            return next(err);
        }
    
        const chatIds = results.map(item => item.ChatId);

        const chatPromises = chatIds.map(chatId => {
            return new Promise((resolve, reject) => {
                const sqlQuery2 = `
               SELECT mg.SenderId, mg.MessageId, u.Name, u.Avatar, u.Bio, u.LastSeen, u.IsActivePrivacy, u.IsLastSeenPrivacy, mg.Content, pc.ChatId
                    FROM Messages mg
                    INNER JOIN PersonalChats pc ON pc.MessageId = mg.MessageId
                    LEFT JOIN PinnedChats pn on pn.ChatId=pc.ChatId
                    Left JOIN ArchivedChats ac on ac.ChatId =pc.ChatId
                    INNER JOIN Members mb ON mb.ChatId = pc.ChatId 
                    INNER JOIN Users u ON u.UserId = mb.UserId
                    WHERE mb.UserId != ? AND mb.ChatId = ? AND pn.ChatId IS NULL AND ac.ChatId IS NULL
                    ORDER BY pc.MessageId DESC
                    LIMIT 1;
                `;

                connection.query(sqlQuery2, [userId, chatId], (err: QueryError | null, result: RowDataPacket[]) => {
                    if (err) {
                        return reject(err);
                    }
                    resolve(result.length > 0 ? result[0] : null); // Resolve with the result or null if no result is found
                });
            });
        });

        Promise.all(chatPromises)
            .then(chatResults => {
                const filteredResults = chatResults.filter(result => result !== null);
                res.status(200).send({ success: true, message: 'Personal chats retrieved successfully', data: filteredResults });
            })
            .catch(err => next(err));
    });
}


export const getGroupChats = async (req: authRequest, res: Response, next: NextFunction) => {

    const userId = req.body.userId; // set by the authenticate middleware
  
    const sqlQuery = `
 select distinct m.ChatId from Members m inner join
  GroupChats gc on gc.ChatId=m.ChatId where m.UserId=?
    `;

    connection.query(sqlQuery, [userId], (err: QueryError | null, results: RowDataPacket[]) => {
        if (err) {
            return next(err);
        }
    
        const chatIds = results.map(item => item.ChatId);

        const chatPromises = chatIds.map(chatId => {
            return new Promise((resolve, reject) => {
                const sqlQuery2 = `
          SELECT distinct gc.MessageId,mg.Content,gr.Name,gr.Avatar,gr.Description,gr.DateCreated,gr.CreatedBy
                    FROM Messages mg
                    INNER JOIN GroupChats gc ON gc.MessageId = mg.MessageId
                    INNER JOIN _Groups gr ON gr.GroupId=gc.GroupId
                    LEFT JOIN PinnedChats pn on pn.ChatId=gc.ChatId
                    Left JOIN ArchivedChats ac on ac.ChatId =gc.ChatId
                    INNER JOIN Members mb ON mb.ChatId = gc.ChatId 
                    WHERE  mb.ChatId = ? AND pn.ChatId IS NULL AND ac.ChatId IS NULL
                    ORDER BY gc.MessageId DESC
                    LIMIT 1;
                `;

                connection.query(sqlQuery2, [chatId], (err: QueryError | null, result: RowDataPacket[]) => {
                    if (err) {
                        return reject(err);
                    }
                    resolve(result.length > 0 ? result[0] : null); // Resolve with the result or null if no result is found
                });
            });
        });

        Promise.all(chatPromises)
            .then(chatResults => {
                const filteredResults = chatResults.filter(result => result !== null);
                res.status(200).send({ success: true, message: 'Group chats retrieved successfully', data: filteredResults });
            })
            .catch(err => next(err));
    });


}


export const getArchivedChats = (req: authRequest, res: Response, next: NextFunction) => {

    const userId = req.userId; // set by the authenticate middleware

    const sqlQuery = `
        SELECT * 
        FROM Messages mg 
        INNER JOIN ArchivedChats ac ON ac.ChatId=mg.ChatId
        INNER JOIN Members mb ON mb.ChatId = ac.ChatId 
        WHERE mb.UserId = ?
    `;

    connection.query(sqlQuery, [userId], (err: QueryError | null, result: RowDataPacket[]) => {
        if (err) {
            return next(err);
        }
        res.status(200).send({ success: true, message: 'Archieved chats retrieved successfully', data: result });
    });
}