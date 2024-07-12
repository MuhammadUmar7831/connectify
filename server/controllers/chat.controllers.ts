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
    const userId = req.userId;

    const receivedMessagesCountTableForGivenChat = `
        SELECT mg2.ChatId, COUNT(*) AS received_count
        FROM Messages mg2
        JOIN MessagesStatus mgs ON mg2.MessageId = mgs.MessageId
        WHERE mgs.Status = 'received' AND mgs.UserId = ?
        GROUP BY mg2.ChatId`

    const queryToFilterArchivedChatsOfGivenUser = `
        SELECT ChatId FROM ArchivedChats WHERE UserId = ?`;

    const nestedQueryToGetLastSentMessageForEachChat = `
        SELECT MAX(mg2.MessageId) 
        FROM Messages mg2 
        WHERE mg2.ChatId = mg1.ChatId`

    const query = `
        SELECT DISTINCT m.ChatId, u.Name, u.Avatar, u.IsActivePrivacy, mg1.*, IFNULL(received_counts.received_count, 0) AS unSeenMessages
        FROM Members m 
        JOIN Users u ON m.UserId = u.UserId
        JOIN PersonalChats pc ON pc.ChatId = m.ChatId
        JOIN Messages mg1 ON m.ChatId = mg1.ChatId
        LEFT JOIN PinnedChats pnc ON pc.ChatId = pnc.ChatId
        LEFT JOIN (
            ${receivedMessagesCountTableForGivenChat}
        ) AS received_counts ON m.ChatId = received_counts.ChatId
        WHERE m.UserId != ?
        AND m.ChatId NOT IN (
            ${queryToFilterArchivedChatsOfGivenUser}
        )
        AND mg1.MessageId = (
            ${nestedQueryToGetLastSentMessageForEachChat}
        );`;

    connection.query(query, [userId, userId, userId], (err: QueryError | null, result: RowDataPacket[]) => {
        if (err) { return next(err) }
        res.status(200).send({ success: true, message: 'Personal chats retrieved successfully', data: result });
    })
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