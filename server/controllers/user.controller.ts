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
    const notInclude = req.body.notInclude;

    // Check if notInclude is provided and is an array of numbers
    if (notInclude && (!Array.isArray(notInclude) || !notInclude.every(Number.isInteger))) {
        return res.status(400).send({ success: false, message: 'Invalid notInclude parameter expected notInclude: number[]' });
    }

    let query = "SELECT UserId, Name, Avatar, Bio FROM Users";
    let queryParams: (number | string)[] = [];

    if (notInclude && notInclude.length > 0) {
        query += " WHERE UserId NOT IN (" + notInclude.map(() => '?').join(',') + ")";
        queryParams = notInclude;
    }

    connection.query(query, queryParams, (err: QueryError | null, result: RowDataPacket[]) => {
        if (err) {
            return next(err);
        }
        return res.status(200).send({ success: true, message: 'Search Result', data: result });
    });
};