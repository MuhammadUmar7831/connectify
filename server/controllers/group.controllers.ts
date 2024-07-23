import { NextFunction, Response } from "express";
import { QueryError, QueryResult, RowDataPacket } from "mysql2";
import connection from "../config/db";
import errorHandler from "../errors/error";
import { authRequest } from "../middlewares/authenticate";
import { removeDuplicates } from "../utils/removeDuplicatesFromArray";

export const deleteGroup = async (
    req: authRequest,
    res: Response,
    next: NextFunction
) => {
    const { groupId } = req.body;

    const query =
        "DELETE FROM Chats WHERE ChatId = (SELECT ChatId FROM _Groups WHERE GroupId = ?);";
    const values: any = [groupId];

    connection.query(query, values, (err: QueryError | null, result: any) => {
        if (err) {
            return next(err);
        }
        res.status(200).send({ success: true, message: "Group Deleted" });
    });
};

export const getCommonGroups = async (
    req: authRequest,
    res: Response,
    next: NextFunction
) => {
    const friendId = parseInt(req.params.friendId);
    if (isNaN(friendId)) {
        return next(errorHandler(400, 'Invalid Paramas Expected friendId: type(number)'));
    }

    if (friendId === req.userId) {
        return next(errorHandler(400, 'You have all groups in common with your own'))
    }

    const query = `
    SELECT 
    g.*, 
    JSON_ARRAYAGG(JSON_OBJECT('UserId', u.UserId, 'UserName', u.Name)) AS Members
    FROM _Groups g  
    JOIN Members m1 on g.ChatId = m1.ChatId 
    JOIN Members m2 on g.ChatId = m2.ChatId
    JOIN Members m3 on g.ChatId = m3.ChatId
    JOIN Users u ON m3.UserId = u.UserId
    WHERE m1.UserId = 1 AND m2.UserId = 2
    GROUP BY g.GroupId;`;

    const values = [friendId, req.userId];
    connection.query(
        query,
        values,
        (err: QueryError | null, result: RowDataPacket[]) => {
            if (err) {
                return next(err);
            }

            res
                .status(200)
                .send({ success: true, message: "Common Groups Found", data: result });
        }
    );
};

export const kickUser = async (req: authRequest, res: Response, next: NextFunction) => {
    const { toBeKickedId, groupId } = req.body
    if (toBeKickedId === req.userId) {
        return next(errorHandler(400, 'Realy! You want to Kick Yourself'))
    }

    const removeAdmin = `DELETE FROM GroupAdmins WHERE UserId = ? AND GroupId = ?;`;
    // const removeUser = `DELETE FROM Members WHERE UserId = ? AND ChatId IN (SELECT ChatId FROM Chats WHERE Type = 'Group' AND ChatId IN (SELECT ChatId FROM _Groups WHERE GroupId = ?))`;
    const removeUser = `DELETE FROM Members WHERE UserId = ? AND ChatId = (SELECT ChatId FROM _Groups WHERE GroupId = ?)`;

    connection.beginTransaction((err: QueryError | null) => {    ///YAHA SE TRANSACTION SHURU HOTI HAI
        if (err) {
            return next(err);
        }
        connection.query(removeUser, [toBeKickedId, groupId], (err: QueryError | null, result: any) => {   ///REMOVING SIMPLE USER FROM THE GROUPS
            if (err) {
                return connection.rollback(() => next(err));
            }
            if (result.affectedRows === 0) {
                return next(errorHandler(404, 'User to be Deleted is not a Member of this Group'));
            }
            connection.query(removeAdmin, [toBeKickedId, groupId], (err: QueryError | null, result: any) => {  ///REMOVING USER FROM ADMINS TABLE IF THE USER IS AN ADMIN
                if (err) {
                    return connection.rollback(() => next(err));
                }
                connection.commit((err: QueryError | null) => {  ///COMMINTING THE SUCCESFULL QUERY RESULTS
                    if (err) {
                        return connection.rollback(() => next(err));
                    }
                    res.status(200).send({ success: true, message: 'User kicked out' });  ///MESSAGE HAS BEEN SENT TO FRONT END
                });
            });
        });
    });
};

export const createGroup = async (req: authRequest, res: Response, next: NextFunction) => {
    const { name, avatar, description, members } = req.body;

    if (
        typeof name !== 'string' ||
        typeof avatar !== 'string' ||
        (description && typeof description !== 'string') ||
        !Array.isArray(members) ||
        !members.every(member => typeof member === 'number')
    ) {
        return res.status(400).send({ success: false, message: 'Invalid request data (name: string, avatar: string, description: string, members: numbers[])' });
    }

    connection.beginTransaction((_err: QueryError | null) => {
        var query = "INSERT INTO Chats (Type) VALUES ('Group')";
        connection.query(query, (err: QueryError | null, result: RowDataPacket) => {
            if (err) { return connection.rollback(() => next(err)) }
            const chatId = result.insertId;

            query = 'INSERT INTO _Groups (Name, Avatar, Description, CreatedBy, ChatId) VALUES (?, ?, ?, ?, ?)';
            connection.query(query, [name, avatar, description, req.userId, chatId], (err: QueryError | null, result: any) => {
                if (err) { return connection.rollback(() => next(err)) }
                const groupId = result.insertId;

                if (req.userId) { members.push(req.userId) }
                const filteredMembers = removeDuplicates<number>(members);

                const membersData = filteredMembers.map(member => [member, chatId]);
                const placeholders = filteredMembers.map(() => '(?, ?)').join(', ');

                query = `INSERT INTO Members (UserId, ChatId) VALUES ${placeholders}`;
                connection.query(query, membersData.flat(), (err: QueryError | null, result: RowDataPacket[]) => {
                    if (err) { return connection.rollback(() => next(err)) }

                    query = "INSERT INTO GroupAdmins (UserId, GroupId) VALUES (?, ?)";
                    connection.query(query, [req.userId, groupId], (err: QueryError | null, result: QueryResult) => {
                        if (err) { return connection.rollback(() => next(err)) }

                        connection.commit((err: QueryError | null) => {
                            if (err) { return connection.rollback(() => next(err)) }

                            res.status(201).send({ success: true, message: 'Group Created', groupId })
                        })
                    })
                })
            })

        })
    })

}

export const leaveGroup = async (req: authRequest, res: Response, next: NextFunction) => {
    const { groupId } = req.body;
    if (typeof groupId !== 'number') {
        return next(errorHandler(400, 'Invalid request data (groupId: number)'))
    }

    var sql = 'SELECT * FROM Members WHERE UserId = ? AND ChatId = (SELECT ChatId FROM _Groups WHERE GroupId = ?)';
    connection.query(sql, [req.userId, groupId], (err: QueryError | null, result: RowDataPacket[]) => {
        if (err) { return connection.rollback(() => next(err)); }
    })

    connection.beginTransaction((_err: QueryError | null) => {

        sql = 'DELETE FROM Members WHERE UserId = ? AND ChatId = (SELECT ChatId FROM _Groups WHERE GroupId = ?)';
        connection.query(sql, [req.userId, groupId], (err: QueryError | null, result: any) => {
            if (err) { return connection.rollback(() => next(err)); }
            if (result.affectedRows === 0) {
                return next(errorHandler(400, 'You are not Member of this Group'))
            }

            sql = 'DELETE FROM GroupAdmins WHERE UserId = ? AND GroupId = ?';
            connection.query(sql, [req.userId, groupId], (err: QueryError | null, result: QueryResult) => {
                if (err) { return connection.rollback(() => next(err)); }

                connection.commit((err: QueryError | null) => {
                    if (err) { return connection.rollback(() => next(err)) }

                    res.status(200).send({ success: true, message: 'Group Left' })
                })
            })
        })
    })
}

export const updateGroup = async (req: authRequest, res: Response, next: NextFunction) => {
    const { groupId, name, avatar, description } = req.body;
    if (
        typeof groupId !== 'number' ||
        typeof name !== 'string' ||
        typeof avatar !== 'string' ||
        typeof description !== 'string'
    ) {
        return res.status(400).send({ success: false, message: 'Invalid request body (groupId: number, name: string, avatar: string, description: string)' });
    }

    const sql = "UPDATE _Groups SET Name = ?, Avatar = ?, Description = ? WHERE GroupId = ?";
    connection.query(sql, [name, avatar, description, groupId], (err: QueryError | null, result: any) => {
        if (err) { return next(err) }
        res.status(201).send({ success: true, message: "Group updated" })
    })
}

export const addMemberToGroup = async (req: authRequest, res: Response, next: NextFunction) => {
    const { groupId, friendId } = req.body
    if (typeof groupId !== 'number' || friendId !== 'number') {
        return res.status(400).send({ success: false, message: 'Invalid request body (groupId: number, friendId: number)' });
    }
    var sql = "SELECT ChatId FROM _Groups where GroupId = ?"
    connection.query(sql, [groupId], (err: QueryError | null, result: RowDataPacket[]) => {
        if (err) { return next(err) }
        const chatId = result[0].ChatId;

        sql = "SELECT UserId FROM Members WHERE ChatId = ? and UserId = ?"
        connection.query(sql, [chatId, friendId], (err: QueryError | null, result: RowDataPacket[]) => {
            if (err) { return next(err) }

            if (result.length > 0) {
                return next(errorHandler(400, "This user is already member of this Group"))
            }
        })

        sql = "INSERT INTO Members (UserId, ChatId) VALUES (?, ?)";
        connection.query(sql, [friendId, chatId], (err: QueryError | null, result: any) => {
            if (err) { return next(err) }
            res.status(201).send({ success: true, message: "User added in the Group" })
        })
    })

}

export const addAdmin = async (
    req: authRequest,
    res: Response,
    next: NextFunction
) => {
    const { friendId, groupId } = req.body;

    // case if the friend is not even the member of the group
    var query =
        "SELECT * FROM Members m WHERE m.UserId = ? AND m.ChatId = (SELECT ChatId FROM _Groups g WHERE g.GroupId = ?);";
    connection.query(
        query,
        [friendId, groupId],
        (err: QueryError | null, result: RowDataPacket[]) => {
            if (err) {
                return next(err);
            }
            if (result.length === 0) {
                return next(errorHandler(400, "This User is not Member of this Group"));
            }

            query = "INSERT INTO GroupAdmins (UserId, GroupId) VALUES (?, ?);";
            connection.query(
                query,
                [friendId, groupId],
                (err: QueryError | null, result: RowDataPacket[]) => {
                    if (err) {
                        return next(err);
                    }
                    res.status(200).send({ success: true, message: "Admin Added" });
                }
            );
        }
    );
};
