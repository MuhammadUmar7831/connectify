import { NextFunction, Request, Response } from "express";

const serverError = (err: any, req: Request, res: Response, next: NextFunction) => {
    const statusCode = err?.statusCode || 500;
    const message = err?.message || "Internal server error";
    res.status(statusCode).send({
        success: false,
        message,
    });
};

export default serverError;