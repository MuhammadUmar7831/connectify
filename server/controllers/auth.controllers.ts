import { CookieOptions, NextFunction, Request, Response } from "express";
import { QueryError, RowDataPacket } from "mysql2";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import connection from "../config/db";
import errorHandler from "../errors/error";

const COOKIE_OPTIONS: CookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production', // Ensure secure cookies in production
  sameSite: 'none' // Adjust based on your cross-site needs ('lax', 'strict', 'none')
};

export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name, email, password, avatar, bio, lastSeen } = req.body;

  const salt = parseInt(process.env.SALT as string);
  const hashedPassword = bcryptjs.hashSync(password, salt);

  const query = `INSERT INTO Users (Name, Email, Password, Avatar, Bio, LastSeen) VALUES (?, ?, ?, ?, ?, ?)`;
  const values = [name, email, hashedPassword, avatar, bio, lastSeen];

  connection.query(query, values, (err: QueryError | null, result: any) => {
    if (err) {
      return next(err);
    }
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
    };
    res
      .cookie("access_token", token, COOKIE_OPTIONS)
      .status(201)
      .send({ success: true, message: "User Registered", user });
  });
};

export const signin = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  const columns = 'u.UserId, Name, Email, Password, Avatar, Bio, LastSeen, IsActivePrivacy, IsLastSeenPrivacy, JSON_ARRAYAGG(m.ChatId) as ChatIds';
  const sql = `SELECT ${columns} FROM Users u JOIN Members m ON u.UserId = m.UserId WHERE u.Email = ? GROUP BY u.UserId`;

  connection.query(sql, [email], (err: QueryError | null, result: RowDataPacket[]) => {
    if (err) {
      return next(err);
    }

    if (result.length === 0) {
      return next(errorHandler(404, "User not Found"));
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
        ChatIds: result[0].ChatIds
      };
      res
        .cookie('access_token', token, COOKIE_OPTIONS)
        .status(200)
        .send({ success: true, message: `Welcome ${result[0].Name}`, user });
    } else {
      return next(errorHandler(404, 'Incorrect Password'));
    }
  });
};

export const signout = async (req: Request, res: Response, next: NextFunction) => {
  res.clearCookie("access_token", COOKIE_OPTIONS);
  res.status(200).send({ success: true, message: "Signout Successfully" });
};
