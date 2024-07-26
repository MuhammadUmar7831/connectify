import { useEffect, useState } from "react";
import { getSocket } from "../config/scoket.config";

export default function useActive(userId: number | null): boolean {
    const socket = getSocket();
    const [onlineUser, setOnlineUsers] = useState<number[]>([]); // state to store all active users
    const [active, setActive] = useState<boolean>(false);

    useEffect(() => {
        const handleGetOnlineUsers = (users: number[]) => {
            setOnlineUsers(users);
        };

        socket?.on("getOnlineUsers", handleGetOnlineUsers);

        return () => {
            socket?.off("getOnlineUsers", handleGetOnlineUsers);
        };
    }, [socket]);

    useEffect(() => {
        if (userId !== null) {
            setActive(onlineUser.includes(userId));
        }
    }, [onlineUser, userId]);

    return active;
}
