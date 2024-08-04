import { NextFunction, Request, Response } from "express";
import { authRequest } from "../middlewares/authenticate";
import connection from "../config/db";
import { QueryError, RowDataPacket } from "mysql2";
import errorHandler from "../errors/error";

export const getUser = async (req: authRequest, res: Response, next: NextFunction) => {
    const columns = 'UserId, Name, Email, Avatar, Bio, LastSeen, IsActivePrivacy, IsLastSeenPrivacy'
    const sql = `SELECT ${columns} FROM Users WHERE UserId = ?`;
    connection.query(sql, [req.userId], (err: QueryError | null, result: RowDataPacket[]) => {
        if (err) { return next(err) }

        res.status(200).send({ success: true, message: 'User Retrieved', user: result[0] })
    })
}

export const getFriendInfo = async (req: Request, res: Response, next: NextFunction) => {
    if (isNaN(parseInt(req.params.friendId))) {
        return next(errorHandler(400, 'Invalid Request Params Expected friendId: type(number)'))
    }
    const query = `SELECT UserId, Name, Email, Avatar, Bio FROM Users WHERE UserId = ?`;
    connection.query(query, [req.params.friendId], (err: QueryError | null, result: RowDataPacket[]) => {
        if (err) { return next(err) }
        if (result.length === 0) {
            return next(errorHandler(404, 'No User Found'));
        }
        return res.status(200).send({ success: true, data: result[0] })
    })

}

export const search = async (req: Request, res: Response, next: NextFunction) => {
    const { query, notInclude } = req.body;

    // Check if query is provided and is a string
    // if (typeof query !== 'string') {
    //     return next(errorHandler(400, 'Invalid query parameter, expected {query: string}'));
    // }

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