import { NextFunction, Request, Response } from "express";
import { authRequest } from "../middlewares/authenticate";
import connection from "../config/db";
import { QueryError, RowDataPacket } from "mysql2";
import errorHandler from "../errors/error";

export const getUser = async (req: authRequest, res: Response, next: NextFunction) => {
    let userId: number | undefined = parseInt(req.query.userId as string);
    if (isNaN(userId)) {
        userId = req.userId
    }
    const columns = 'u.UserId, Name, Email, Avatar, Bio, LastSeen, IsActivePrivacy, IsLastSeenPrivacy, JSON_ARRAYAGG(m.ChatId) as ChatIds'
    const sql = `SELECT ${columns} FROM Users u JOIN Members m ON u.UserId = m.UserId WHERE u.UserId = ? GROUP BY u.UserId`;
    connection.query(sql, [userId], (err: QueryError | null, result: RowDataPacket[]) => {
        if (err) { return next(err) }

        res.status(200).send({ success: true, message: 'User Retrieved', user: result[0] })
    })
}


export const updateUser=async(req:authRequest,res:Response,next:NextFunction)=>{
    const { UserId, Name, Avatar, Bio } = req.body;
    if (
        typeof UserId !== 'number' ||
        typeof Name !== 'string' ||
        typeof Avatar !== 'string' ||
        typeof Bio !== 'string'
    ) {
        return res.status(400).send({ success: false, message: 'Invalid request body (UserId: number, Name: string, Avatar: string, Bio: string)' });
    }

    const sql = "UPDATE Users SET Name = ?, Avatar = ?, Bio = ? WHERE UserId = ?";
    connection.query(sql, [Name, Avatar, Bio, UserId], (err: QueryError | null, result: any) => {
        if (err) { return next(err) }
        res.status(201).send({ success: true, message: "User updated" })
    })
}

export const getFriendInfo = async (req: Request, res: Response, next: NextFunction) => {
    const myId = parseInt(req.query.myId as string);
    const friendId = parseInt(req.query.friendId as string);

    // Validate query parameters
    if (isNaN(myId) || isNaN(friendId)) {
        return next(errorHandler(400, 'Invalid Request Params: Expected myId and friendId to be numbers'));
    }
    if (myId === friendId) {
        return next(errorHandler(400, 'Come on,You are Requesting Your Own Info'));
    }

    const query = `
    SELECT 
    u.UserId, u.Name, u.Bio, u.Email, u.Avatar,
    (
        SELECT c.ChatId FROM Chats c JOIN Members m ON c.ChatId = m.ChatId WHERE c.Type = 'personal' AND m.UserId = u.UserId
        AND c.ChatId IN
            (SELECT c.ChatId FROM Chats c join Members m ON c.ChatId = m.ChatId WHERE c.Type = 'personal' AND m.UserId = ?)
    )
    AS ChatId
    FROM Users u WHERE u.UserId = ?;`;

    connection.query(query, [myId, friendId], (err: QueryError | null, result: RowDataPacket[]) => {
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