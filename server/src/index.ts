import express, { Express, NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import tryCatch from "../middlewares/tryCatch";
import serverError from "../errors/serverError";
import authRoutes from "../routes/auth.routes";
import userRoutes from "../routes/user.routes";
import chatRoutes from "../routes/chat.routes";
import groupRoutes from "../routes/group.routes";
import messageRoutes from "../routes/message.routes";

dotenv.config();

const app: Express = express();
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
}));
app.use(cookieParser());



app.get("/", tryCatch((req: Request, res: Response, next: NextFunction) => {
    res.status(200).send('Wellcome to Connectify');
}));
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/group', groupRoutes);
app.use('/api/message', messageRoutes);
app.use(serverError);

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
