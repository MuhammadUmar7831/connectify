import { NextFunction, Request, Response } from "express"
import { QueryError, QueryResult, RowDataPacket } from "mysql2";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import connection from "../config/db";
import errorHandler from "../errors/error";
import sendWelcomeEmail from "../config/sendEmail";

export const signup = async (req: Request, res: Response, next: NextFunction) => {
    const { name, email, password, avatar, bio, lastSeen } = req.body;

    const salt = parseInt(process.env.SALT as string);
    const hashedPassword = bcryptjs.hashSync(password, salt);

    const query = `INSERT INTO Users (Name, Email, Password, Avatar, Bio, LastSeen) VALUES (?, ?, ?, ?, ?, ?)`;
    const values: any = [name, email, hashedPassword, avatar, bio, lastSeen];

    connection.query(query, values, (err: QueryError | null, result: any) => {
        if (err) { return next(err) }
        const token = jwt.sign({ email: email }, process.env.JWT_SECRET as string);

        const user = {
            UserId: result.insertId,
            Name: name,
            Email: email,
            Avatar: avatar,
            Bio: bio,
            LastSeen: Date.now(),
            IsActivePrivacy: 0,
            IsLastSeenPrivacy: 0,
        }
        sendWelcomeEmail(email,name)
        res
            .cookie('access_token', token, { httpOnly: true })
            .status(201)
            .send({ success: true, message: 'User Registered', user });
    })
}

export const signin = async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    const query = 'SELECT * FROM Users WHERE Email = ?';
    connection.query(query, [email], (err: QueryError | null, result: RowDataPacket[]) => {
        if (err) { return next(err) }

        if (result.length === 0) {
            return next(errorHandler(404, 'User not Found'))
        }

        const validPassword = bcryptjs.compareSync(password, result[0].Password);
        if (validPassword) {
            const token = jwt.sign({ email: email }, process.env.JWT_SECRET as string);
            const user = {
                UserId: result[0].UserId,
                Name: result[0].Name,
                Email: result[0].Email,
                Avatar: result[0].Avatar,
                Bio: result[0].Bio,
                LastSeen: result[0].LastSeen,
                IsActivePrivacy: result[0].IsActivePrivacy,
                IsLastSeenPrivacy: result[0].IsLastSeenPrivacy,
            }
            res
                .cookie('access_token', token, { httpOnly: true, secure: true })
                .status(200)
                .send({ success: true, message: `Wellcome ${result[0].Name}`, user });
        } else {
            return next(errorHandler(404, 'Invalid Email or Password'));
        }
    })
}