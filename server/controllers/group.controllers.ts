import { NextFunction, Request, Response } from "express";
import { QueryError, QueryResult, RowDataPacket } from "mysql2";
import connection from "../config/db";
import errorHandler from "../errors/error";
import { authRequest } from "../middlewares/authenticate";

export const deleteGroup = async (req: authRequest, res: Response, next: NextFunction) => {
  const { groupId } = req.body;

  const query = "DELETE FROM Chats WHERE ChatId = (SELECT ChatId FROM _Groups WHERE GroupId = ?);";
  const values: any = [groupId];

  connection.query(query, values, (err: QueryError | null, result: any) => {
    if (err) {
      return next(err);
    }
    res
      .status(200)
      .send({ success: true, message: 'Group Deleted' });
  });
};

export const getCommonGroups = async (req: authRequest, res: Response, next: NextFunction) => {
  const friendId = req.params.friendId;
  const userId = req.userId;

  const query = `SELECT g.* FROM _Groups g  JOIN Members m1 on g.ChatId = m1.ChatId JOIN Members m2 on g.ChatId = m2.ChatId WHERE m1.UserId = 2 AND m2.UserId = 1;`
  const values = [friendId, userId]
  connection.query(query, values, (err: QueryError | null, result: RowDataPacket[]) => {
    if (err) {
      return next(err)
    }

    if (result.length === 0) {
      res.status(403).send({ success: false, message: "No Common Groups", data: null })
    }

    res.status(200).send({ success: true, message: "Common Groups Found", data: result })
  })
}

export const addAdmin = async (req: authRequest, res: Response, next: NextFunction) => {
  const { friendId, groupId } = req.body;

  // case if the friend is not even the member of the group
  var query = 'SELECT * FROM Members m WHERE m.UserId = ? AND m.ChatId = (SELECT ChatId FROM _Groups g WHERE g.GroupId = ?);';
  connection.query(query, [friendId, groupId], (err: QueryError | null, result: RowDataPacket[]) => {
    
    if (err) { return next(err) }
    if (result.length === 0) { return next(errorHandler(400, 'This User is not Member of this Group')) }

    query = 'INSERT INTO GroupAdmins (UserId, GroupId) VALUES (?, ?);';
    connection.query(query, [friendId, groupId], (err: QueryError | null, result: RowDataPacket[]) => {
      if (err) { return next(err) }
      res.status(200).send({ success: true, message: 'Admin Added' });
    })

  })
}