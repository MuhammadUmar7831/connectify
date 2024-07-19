import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import errorHandler from "../errors/error";
import connection from "../config/db";
import { QueryError, RowDataPacket } from "mysql2";

interface _JwtPayload extends JwtPayload {
  email: string;
}

export interface authRequest extends Request {
  userId?: number;
}

const authenticate = async (
  req: authRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = await req.cookies.access_token;
    if (token === undefined) {
      next(errorHandler(404, "Please Login to Continue"));
    }
    const decode = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as _JwtPayload;
    const userEmail: string = decode.email as string;
    const query: string = `SELECT * FROM Users WHERE Email = ?`;
    connection.query(
      query,
      [userEmail],
      (err: QueryError | null, result: RowDataPacket[]) => {
        if (err) {
          return next(err);
        }
        if (result.length === 0) {
          return next(errorHandler(404, "Please Login to Continue"));
        }
        req.userId = result[0].UserId;
        next();
      }
    );
  } catch (error) {
    next(error);
  }
};

export default authenticate;
