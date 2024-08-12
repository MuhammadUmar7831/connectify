import { QueryError } from "mysql2";
import connection from "../config/db";

const setSentMessagesToReceived = async (userId: number) => {
    const query =
        `UPDATE MessagesStatus 
        SET Status = 'received' 
        WHERE UserId = ? AND Status 'sent';`;

    try {
        await new Promise<void>((resolve, reject) => {
            connection.query(query, [userId], (err: QueryError | null) => {
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

export default setSentMessagesToReceived;