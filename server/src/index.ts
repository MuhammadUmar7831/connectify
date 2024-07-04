import express, { Express, NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import tryCatch from "../middlewares/tryCatch";
import serverError from "../errors/serverError";
import authRoutes from "../routes/auth.routes";
import chatRoutes from "../routes/chat.routes";
import groupRoutes from "../routes/group.routes";

dotenv.config();

const app: Express = express();
app.use(serverError);


app.get("/", tryCatch((req: Request, res: Response, next: NextFunction) => {
    res.status(200).send('Wellcome to Connectify');
}));
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/group', groupRoutes);

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
