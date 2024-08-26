import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;
export const createSocket = (userId: number, chatIds: number[]) => {
    if (!socket || !socket.connected) {
        socket = io(import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000', {
            query: {
                userId: userId.toString(),  // Ensure userId is a string
                chatIds: chatIds.join(','), // Convert array to comma-separated string
            },
            transports: ['websocket', 'polling'],
            withCredentials: true, // Ensure credentials are sent
        });
    }
    return socket;
};

export const getSocket = () => {
    return socket;
};