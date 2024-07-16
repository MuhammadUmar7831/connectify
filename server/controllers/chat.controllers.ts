import { NextFunction, Response } from "express";
import { authRequest } from "../middlewares/authenticate";
import connection from "../config/db";
import { QueryError, QueryResult, RowDataPacket } from "mysql2";
import errorHandler from "../errors/error";
import { getGroupChatsQuery, getPersonalChatQuery } from "../utils/getChatQuries";

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
    const sql = `${getPersonalChatQuery}  AND
    c.ChatId NOT IN (
        select ChatId from PinnedChats Where UserId = ?
    ) AND 
    c.ChatId NOT IN (
        SELECT ChatId FROM ArchivedChats WHERE UserId = ?
    )
    ORDER BY TimeStamp DESC;`
    connection.query(sql, [req.userId, req.userId, req.userId, req.userId, req.userId], (err: QueryError | null, result: RowDataPacket[]) => {
        if (err) { return next(err); }

        res.status(200).send({ success: true, message: 'Personal Chats retrieved', data: result })
        // res.status(200).json(result);
    });
}


export const getGroupChats = async (req: authRequest, res: Response, next: NextFunction) => {
    const sql = `${getGroupChatsQuery}
    WHERE 
    g.ChatId NOT IN (
        select ChatId from PinnedChats Where UserId = ?
    ) AND 
    g.ChatId NOT IN (
        SELECT ChatId FROM ArchivedChats WHERE UserId = ?
    )
    ORDER BY TimeStamp DESC;`
    connection.query(sql, [req.userId, req.userId, req.userId, req.userId], (err: QueryError | null, result: RowDataPacket[]) => {
        if (err) {
            return next(err);
            // console.error('Error executing query:', err);
            // return res.status(500).json({ error: 'Error executing query' });
        }

        res.status(200).send({ success: true, message: 'Group chats retrieved', data: result });
    });

}
export const getArchivedChats = (req: authRequest, res: Response, next: NextFunction) => {
    
    const sqlQuery = `
        ${getPersonalChatQuery} AND
        c.ChatId IN (
            SELECT ChatId FROM ArchivedChats WHERE UserId = ?
        )
        UNION
        ${getGroupChatsQuery}
        WHERE 
        g.ChatId IN (
            SELECT ChatId FROM ArchivedChats WHERE UserId = ?
        )
        ORDER BY TimeStamp DESC;`;

    connection.query(sqlQuery, [req.userId, req.userId, req.userId, req.userId, req.userId, req.userId, req.userId], (err: QueryError | null, result: RowDataPacket[]) => {
        if (err) {
            return next(err);
        }
        res.status(200).send({ success: true, message: 'Archived chats retrieved successfully', data: result });
    });
}



export const getPinnedChats = (req: authRequest, res: Response, next: NextFunction) => {
    const sqlQuery = `
        ${getPersonalChatQuery} AND
        c.ChatId IN (
        SELECT ChatId FROM PinnedChats Where UserId = ?
        ) AND 
        c.ChatId NOT IN (
            SELECT ChatId FROM ArchivedChats WHERE UserId = ?
        )
        UNION
        ${getGroupChatsQuery}
        WHERE 
        g.ChatId IN (
            select ChatId from PinnedChats Where UserId = ?
        ) AND 
        g.ChatId NOT IN (
            SELECT ChatId FROM ArchivedChats WHERE UserId = ?
        )
        ORDER BY TimeStamp DESC;`;

    connection.query(sqlQuery, [req.userId, req.userId, req.userId, req.userId, req.userId, req.userId, req.userId, req.userId, req.userId], (err: QueryError | null, result: RowDataPacket[]) => {
        if (err) {
            return next(err);
        }
        if (result.length == 0)
            res.status(404).send({ success: false, message: 'chat not Existed', data: result });

        res.status(200).send({ success: true, message: 'Archieved chats retrieved successfully', data: result });
    });
}