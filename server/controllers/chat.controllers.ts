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

    // const { userId } = req.body; 
    const userId = req.userId; // set by the authenticate middleware
    // if (!userId) {
    //     return res.status(400).send({ success: false, message: 'User ID is required' });
    // }

    // not select messages we just need chat
    const sqlQuery = `
        SELECT * 
        FROM Messages mg 
        INNER JOIN PersonalChats pc ON pc.MessageId = mg.MessageId 
        INNER JOIN Members mb ON mb.ChatId = pc.ChatId 
        WHERE mb.UserId = ?
    `;

    connection.query(sqlQuery, [userId], (err: QueryError | null, result: RowDataPacket[]) => {
        if (err) {
            return next(err);
        }
        res.status(200).send({ success: true, message: 'Personal chats retrieved successfully', data: result });
    });


}


export const getGroupChats = async (req: authRequest, res: Response, next: NextFunction) => {

    res.send("ok");


}


export const getArchivedChats = (req: authRequest, res: Response, next: NextFunction) => {

    // const { userId } = req.body;
    const userId = req.userId; // set by the authenticate middleware
    // if (!userId) {
    //     return res.status(400).send({ success: false, message: 'User ID is required' });
    // }

    // not select messages we just need chat
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