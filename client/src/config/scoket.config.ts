import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;
export const createSocket = (userId: number) => {
    if (!socket) {
        socket = io(import.meta.env.API_BASE_URL || 'http://localhost:3000', {
            query: { userId }
        })
    }
    return socket;
}

export const getSocket = () => {
    return socket;
};