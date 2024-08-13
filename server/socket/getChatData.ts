import { QueryError, RowDataPacket } from "mysql2";
import connection from "../config/db";
import { getGroupChatsQuery, getPersonalChatQuery } from "../utils/getChatQuries";

export const getChatData = async (userId: string, chatId: number, type: string) => {
    let query = type === 'personal' ? getPersonalChatQuery : getGroupChatsQuery;

    try {
        const data = await new Promise<RowDataPacket>((resolve, reject) => {
            connection.query(`${query} AND c.ChatId = ?`, [userId, chatId], (err: QueryError | null, result: RowDataPacket[]) => {
                if (err) {
                    reject(err);
                } else {
                    if (result.length === 0) { reject(new Error('server/socket/getChatData: This is not Possible')) }
                    resolve(result[0]);
                }
            });
        });

        return { success: true, data };
    } catch (error: any) {
        return { success: false, message: error.message };
    }
}