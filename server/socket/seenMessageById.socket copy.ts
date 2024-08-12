import { QueryError, RowDataPacket } from "mysql2";
import connection from "../config/db";

export const messageSeenById = async (userId: string, messageId: number) => {
    let query =
        `UPDATE MessagesStatus 
    SET Status = 'seen' 
    WHERE UserId = ? 
    AND MessageId = ?`;

    try {
        await new Promise<void>((resolve, reject) => {
            connection.query(query, [userId, messageId], (err: QueryError | null) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });

        query = "SELECT * FROM ChatMessages WHERE MessageId = ?";
        const data = await new Promise<RowDataPacket>((resolve, reject) => {
            connection.query(query, [messageId], (err: QueryError | null, result: RowDataPacket[]) => {
                if (err) {
                    reject(err);
                } else if (result.length === 0) {
                    console.log('This is not Possible')
                    reject(new Error('Why not You Stupid Bastard?'))
                } else {
                    resolve(result[0]);
                }
            });
        });

        return { success: true, data };
    } catch (error: any) {
        return { success: false, message: error.message };
    }
}