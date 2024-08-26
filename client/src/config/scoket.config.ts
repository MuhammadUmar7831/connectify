import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;
export const createSocket = (userId: number, chatIds: number[]) => {
    if (!socket || !socket.connected) {
        socket = io(import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000', {
            query: { userId, chatIds },
            withCredentials: true,
        })
    }
    return socket;
}

export const getSocket = () => {
    return socket;
};