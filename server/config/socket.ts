import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import http from "http";
import { Server } from "socket.io";

export const app = express();
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
}));
app.use(cookieParser());

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
        credentials: true,
    },
});

interface UserSocketMap {
    [userId: number]: string; // Maps userId to socketId
}

const userSocketMap: UserSocketMap = {}; // Initialize as an empty object

const getReceiverSocketId = (receiverId: number): string | undefined => {
    return userSocketMap[receiverId];
};

io.on('connection', (socket) => {
    const userId = socket.handshake.query.userId as string;
    userSocketMap[parseInt(userId)] = socket.id;

    io.emit("getOnlineUsers", Object.keys(userSocketMap).map(key => parseInt(key)));
    console.log(userId);

    socket.on("startTyping", (chatId) => {
        console.log(`User with Id ${userId} Started Typing... in Chat Id ${chatId}`);
        io.emit('userTyping', userId, chatId);
    })

    // Handle other socket events
    socket.on('disconnect', () => {
        delete userSocketMap[parseInt(userId)];
        io.emit("getOnlineUsers", Object.keys(userSocketMap).map(key => parseInt(key)));
    });
});

export default server;
