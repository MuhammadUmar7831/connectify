import { NextFunction, Request, Response } from "express"
import { QueryError, QueryResult } from "mysql2";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import connection from "../config/db";

export const signup = async (req: Request, res: Response, next: NextFunction) => {
    const { name, email, password, avatar, bio, lastSeen } = req.body;

    const salt = parseInt(process.env.SALT as string);
    const hashedPassword = bcryptjs.hashSync(password, salt);

    const query = `INSERT INTO Users (Name, Email, Password, Avatar, Bio, LastSeen) VALUES (?, ?, ?, ?, ?, ?)`;
    const values: any = [name, email, hashedPassword, avatar, bio, lastSeen];

    connection.query(query, values, (err: QueryError | null, result: QueryResult) => {
        if (err) { return next(err) }
        const token = jwt.sign({ email: email }, process.env.JWT_SECRET as string);

        res
            .cookie('access_token', token, { httpOnly: true })
            .status(201)
            .send({ success: true, message: 'User Registered' });
    })
}