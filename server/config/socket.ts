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

    socket.on("startTyping", (chatId, userName) => {
        io.emit('userTyping', userId, userName, chatId);
    })

    // TO DO
    // 1. a scoket on that will listen when message is sent successfully
    // 2. inside above socket on an emit that will be listened by client side chat list component that there is some message (with cheen tapak dum dum)
    // 3. on client side use usePara to get chatId if chatId is equal to the chatId of the message ChatId emitted then no Cheen Tapak Dum Dum
    // 4. also if param chatId is not eqault to chatId of emitted message than increase the notification number by in chatList Item

    // Handle other socket events
    socket.on('disconnect', () => {
        // TO DO 
        // 1. Set Last of this user to current time
        delete userSocketMap[parseInt(userId)];
        io.emit("getOnlineUsers", Object.keys(userSocketMap).map(key => parseInt(key)));
    });
});

export default server;
