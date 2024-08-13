import { Express, NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import tryCatch from "../middlewares/tryCatch";
import serverError from "../errors/serverError";
import authRoutes from "../routes/auth.routes";
import userRoutes from "../routes/user.routes";
import chatRoutes from "../routes/chat.routes";
import groupRoutes from "../routes/group.routes";
import messageRoutes from "../routes/message.routes";
import server, { app } from "../config/socket";
import CORS from "cors"

dotenv.config();



app.get("/", tryCatch((req: Request, res: Response, next: NextFunction) => {
    res.status(200).send('Wellcome to Connectify');
}));
app.use(CORS({ origin: 'http://localhost:5173' }));
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/group', groupRoutes);
app.use('/api/message', messageRoutes);
app.use(serverError);

const port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
