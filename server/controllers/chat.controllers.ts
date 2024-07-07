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
        var sql = "INSERT INTO Chats (Type) VALUES ('Personal')";
        connection.query(sql, (err: QueryError | null, result: RowDataPacket) => {
            if (err) { return connection.rollback(() => next(err)) }

            const chatId = result.insertId;
            // second create a message which referes to the chat created
            sql = 'INSERT INTO Messages (ChatId, SenderId, Content) VALUES (?, ?, ?)';
            connection.query(sql, [chatId, req.userId, content], (err: QueryError | null, _result: QueryResult | any) => {
                if (err) { connection.rollback(() => next(err)) }

                // third create a PersonalChat
                sql = 'INSERT INTO PersonalChats (ChatId, MessageId) VALUES (?, ?)';
                connection.query(sql, [chatId, _result.insertId], (err: QueryError | null, result_: QueryResult) => {
                    if (err) { return connection.rollback(() => next(err)) }

                    // fourth add 2 members to the chat
                    sql = 'INSERT INTO Members (UserId, ChatId) VALUES (?, ?), (?, ?)';
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