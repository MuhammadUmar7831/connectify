import { NextFunction, Response } from "express";
import { authRequest } from "./authenticate";
import errorHandler from "../errors/error";
import connection from "../config/db";
import { QueryError, RowDataPacket } from "mysql2";

const isMember = async (req: authRequest, res: Response, next: NextFunction) => {
    const { chatId } = req.body;

    if (typeof chatId !== 'number') {
        return next(errorHandler(400, 'Invalid request body expected {chatId: number}'));
    }

    const query = "SELECT * FROM Chats c JOIN Members m ON c.ChatId = m.ChatId WHERE c.ChatId = ? AND m.UserId = ?;";
    connection.query(query, [chatId, req.userId], (err: QueryError | null, result: RowDataPacket[]) => {
        if (err) { return next(err) }
        if (result.length === 0) {
            return next(errorHandler(404, "You are not Member of this Chat"));
        }
        next();
    })
}

export default isMember;