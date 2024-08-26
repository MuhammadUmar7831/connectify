import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import http from "http";
import { Server } from "socket.io";
import { sendMessage } from "../socket/sendMessage.socket";
import { allMessageSeen } from "../socket/allMessagesSeen.scoket";
import { messageSeenById } from "../socket/seenMessageById.socket";
import setSentMessagesToReceived from "../socket/setSentMessagesToReceived";
import { getChatData } from "../socket/getChatData";
import dotenv from 'dotenv';

dotenv.config();

export const app = express();
app.use(express.json());
app.use(cors({
    origin: process.env.VITE_API_BASE_URL,
    credentials: true,
}));
app.use(cookieParser());

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: process.env.VITE_API_BASE_URL,
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
    let chatIds: string[] = [];

    // Directly handle chatIds if it's already an array
    if (socket.handshake.query.chatIds) {
        chatIds = (socket.handshake.query.chatIds as string).split(',');

        // Validate if chatIds is an array of numbers
        if (!Array.isArray(chatIds) || !chatIds.every(id => typeof id === 'string')) {
            console.error('Invalid chatIds format');
            socket.disconnect();
            return;
        }
    }
    // this join user all chat room in which he is member
    chatIds.forEach((chatId: string) => {
        const room = `chat_${chatId}`;
        socket.join(room);
    })

    userSocketMap[parseInt(userId)] = socket.id;
    setSentMessagesToReceived(parseInt(userId));

    io.emit("getOnlineUsers", Object.keys(userSocketMap).map(key => parseInt(key)));
    socket.broadcast.emit("userOnline", userId); // tell all other users that someone is online

    socket.on("chatOpened", async (chatId: number) => {
        const room = `chat_${chatId}`;
        const res = await allMessageSeen(userId, chatId);
        if (res.success) {
            io.to(room).emit('seenAllMessage', userId, chatId);
        } else {
            io.to(room).emit('error', res.message);
        }
    });

    socket.on("startTyping", (chatId, userName) => {
        const room = `chat_${chatId}`;
        io.to(room).emit('userTyping', userId, userName, chatId);
    });

    socket.on("messageSent", async (messageId: number) => {
        const res = await sendMessage(messageId);
        if (res.success) {
            const room = `chat_${res.data.ChatId}`;
            io.to(room).emit('messageReceived', res.data);
        } else {
            console.log(res.message);
        }
    });

    socket.on('singleMessageSeen', async (messageId: number) => {
        const res = await messageSeenById(userId, messageId);
        if (res.success && res.data) {
            const room = `chat_${res.data.ChatId}`;
            io.to(room).emit('singleMessageHasBeenSeen', userId, res.data.ChatId, res.data.MessageId);
        } else {
            console.log(res.message);
        }
    });

    socket.on("chatCreated", async (data: { chatId: number, type: string, members: number[] }) => {
        const res = await getChatData(userId, data.chatId, data.type);
        if (res.success) {
            const room = `chat_${data.chatId}`;

            // each member joins the chat room
            data.members.forEach((memberId) => {
                const memberSocketId = userSocketMap[memberId]; // Get the socket ID of the member
                if (memberSocketId) {
                    const memberSocket = io.sockets.sockets.get(memberSocketId); // Get the socket instance
                    if (memberSocket) {
                        memberSocket.join(room); // Join the chat room for this specific member
                    }
                }
            });

            // Notify all members in the room that the chat is being created
            io.to(room).emit('chatIsBeingCreated', res.data, data.type);
        } else {
            console.log(res.message);
        }
    });

    socket.on("chatLeft", (chatId: number) => {
        const roomName = `chat_${chatId}`;
        socket.emit("chatLeft", chatId) // tell the user about chat left
        socket.leave(roomName);
    })

    socket.on("chatDeleted", (chatId: number) => {
        const roomName = `chat_${chatId}`;
        io.to(roomName).emit("chatDeleted", chatId) // tell all users about that chat delted
        io.sockets.adapter.rooms.delete(roomName);
    })

    // Handle other socket events
    socket.on('disconnect', () => {
        // TO DO 
        // 1. Set Last of this user to current time
        delete userSocketMap[parseInt(userId)];
        io.emit("getOnlineUsers", Object.keys(userSocketMap).map(key => parseInt(key)));
    });
});


export default server;
