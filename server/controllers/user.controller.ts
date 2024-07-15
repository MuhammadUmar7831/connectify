import { NextFunction, Response } from "express";
import { authRequest } from "../middlewares/authenticate";
import connection from "../config/db";
import { QueryError, RowDataPacket } from "mysql2";

export const getUser = async (req: authRequest, res: Response, next: NextFunction) => {
    const columns = 'UserId, Name, Email, Avatar, Bio, LastSeen, IsActivePrivacy, IsLastSeenPrivacy'
    const sql = `SELECT ${columns} FROM Users WHERE UserId = ?`;
    connection.query(sql, [req.userId], (err: QueryError | null, result: RowDataPacket[]) => {
        if (err) { return next(err) }

        res.status(200).send({ success: true, message: 'User Retrieved', user: result[0] })
    })
}