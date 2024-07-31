import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import http from "http";
import { Server } from "socket.io";
import { sendMessage } from "../socket/sendMessage.socket";
import { allMessageSeen } from "../socket/allMessagesSeen.scoket";
import { messageSeenById } from "../socket/seenMessageById.socket";

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

export const userSocketMap: UserSocketMap = {}; // Initialize as an empty object

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

    socket.on("messageSent", async (messageId: number) => {
        const res = await sendMessage(messageId);
        if (res.success) {
            io.emit('messageReceived', res.data);
        } else {
            io.emit('error', res.message);
        }
    })

    socket.on("chatOpened", async (chatId: number) => {
        const res = await allMessageSeen(userId, chatId);
        if (res.success) {
            io.emit('seenAllMessage', userId);
        } else {
            io.emit('error', res.message);
        }
    })

    socket.on('singleMessageSeen', async (messageId: number) => {
        const res = await messageSeenById(userId, messageId);
        if (res.success) {
            io.emit('singleMessageHasBeenSeen', res.data);
        } else {
            io.emit('error', res.message);
        }
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
