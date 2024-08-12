import { NextFunction, Request, Response } from "express";
import { authRequest } from "../middlewares/authenticate";
import connection from "../config/db";
import { QueryError, RowDataPacket } from "mysql2";
import errorHandler from "../errors/error";

export const getUser = async (req: authRequest, res: Response, next: NextFunction) => {
    const columns = 'u.UserId, Name, Email, Avatar, Bio, LastSeen, IsActivePrivacy, IsLastSeenPrivacy, JSON_ARRAYAGG(m.ChatId) as ChatIds'
    const sql = `SELECT ${columns} FROM Users u JOIN Members m ON u.UserId = m.UserId WHERE u.UserId = ? GROUP BY u.UserId`;
    connection.query(sql, [req.userId], (err: QueryError | null, result: RowDataPacket[]) => {
        if (err) { return next(err) }

        res.status(200).send({ success: true, message: 'User Retrieved', user: result[0] })
    })
}

export const getFriendInfo = async (req: Request, res: Response, next: NextFunction) => {
    const myId = parseInt(req.query.myId as string);
    const friendId = parseInt(req.query.friendId as string);

    // Validate query parameters
    if (isNaN(myId) || isNaN(friendId)) {
        return next(errorHandler(400, 'Invalid Request Params: Expected myId and friendId to be numbers'));
    }

    const query = `
        SELECT
            u.UserId, u.Name, u.Bio, u.Email, u.Avatar, uc2.ChatId
        FROM Users u
        LEFT JOIN (
            SELECT m.*
            FROM Members m
            JOIN Chats c ON m.ChatId = c.ChatId
            WHERE m.UserId = ? AND c.Type = 'Personal'
        ) uc1 ON u.UserId = uc1.UserId
        LEFT JOIN (
            SELECT m.ChatId
            FROM Members m
            JOIN Chats c ON m.ChatId = c.ChatId
            WHERE m.UserId = ? AND c.Type = 'Personal'
        ) uc2 ON uc1.ChatId = uc2.ChatId
        WHERE u.UserId = ?;
    `;

    connection.query(query, [friendId, myId, friendId], (err: QueryError | null, result: RowDataPacket[]) => {
        if (err) {
            return next(err);
        }
        if (result.length === 0) {
            return next(errorHandler(404, 'No User Found'));
        }
        return res.status(200).send({ success: true, data: result[0] });
    });
};

export const search = async (req: Request, res: Response, next: NextFunction) => {
    const { query, notInclude } = req.body;

    // Check if notInclude is provided and is an array of numbers
    if (typeof query !== 'string' || (notInclude && (!Array.isArray(notInclude) || !notInclude.every(Number.isInteger)))) {
        return next(errorHandler(400, 'Invalid notInclude parameter, expected {query: string, notInclude: number[]}'));
    }

    let _query = "SELECT UserId, Name, Avatar, Bio FROM Users WHERE ( Name LIKE ? OR Bio LIKE ? )";
    let queryParams: (number | string)[] = [`%${query}%`, `%${query}%`];

    if (notInclude && notInclude.length > 0) {
        _query += " AND UserId NOT IN (" + notInclude.map(() => '?').join(',') + ")";
        queryParams.push(...notInclude);
    }

    connection.query(_query, queryParams, (err: QueryError | null, result: RowDataPacket[]) => {
        if (err) {
            return next(err);
        }
        return res.status(200).send({ success: true, message: 'Search Result', data: result });
    });
};