import { QueryError } from "mysql2";
import connection from "../config/db";

export const allMessageSeen = async (userId: string, chatId: number) => {
    let query =
        `UPDATE MessagesStatus 
    SET Status = 'seen' 
    WHERE UserId = ? 
    AND MessageId IN (SELECT MessageId FROM Messages WHERE ChatId = ?)`;

    try {
        await new Promise<void>((resolve, reject) => {
            connection.query(query, [userId, chatId], (err: QueryError | null) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });

        return { success: true };
    } catch (error: any) {
        return { success: false, message: error.message };
    }
}