import { QueryError, RowDataPacket } from "mysql2";
import connection from "../config/db";
import { userSocketMap } from "../config/socket";

interface UserStatus {
    Status: string;
    UserId: number;
    UserName: string;
}

// this function will 
// 1. update status for all members except me 
// 2. send the message in response to client to update their chatArea and chatListItem 
export const sendMessage = async (messageId: number): Promise<{ success: boolean, data?: any, message?: string }> => {
    const onlineUsers = Object.keys(userSocketMap).map(key => parseInt(key));
    let query = "UPDATE MessagesStatus SET Status = 'received' WHERE MessageId = ? AND UserId IN (?)";

    try {
        await new Promise<void>((resolve, reject) => {
            connection.query(query, [messageId, onlineUsers], (err: QueryError | null) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });

        query =
            `SELECT DISTINCT
                cm.*, 
                IF(ac.UserId IS NOT NULL, 'archived', 
                IF(pc.UserId IS NOT NULL, 'pinned', 
                IF(c.Type = 1, 'personal', 'group'))) AS chatType
            FROM 
                ChatMessages cm
            LEFT JOIN 
                ArchivedChats ac ON cm.ChatId = ac.ChatId
            LEFT JOIN 
                PinnedChats pc ON cm.ChatId = pc.ChatId
            JOIN 
                Chats c ON cm.ChatId = c.ChatId
            WHERE 
                cm.MessageId = ?;`;
        const result = await new Promise<RowDataPacket[]>((resolve, reject) => {
            connection.query(query, [messageId], (err: QueryError | null, result: RowDataPacket[]) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });

        return { success: true, data: result[0] };
    } catch (error: any) {
        return { success: false, message: error.message };
    }
};
