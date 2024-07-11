import { NextFunction, Response } from "express";
import { QueryError, RowDataPacket } from "mysql2";
import connection from "../config/db";
import errorHandler from "../errors/error";
import { authRequest } from "../middlewares/authenticate";

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
  const friendId = req.params.friendId;
  const userId = req.userId;

  const query = `SELECT g.* FROM _Groups g  JOIN Members m1 on g.ChatId = m1.ChatId JOIN Members m2 on g.ChatId = m2.ChatId WHERE m1.UserId = ? AND m2.UserId = ?;`;
  const values = [friendId, userId];
  connection.query(
    query,
    values,
    (err: QueryError | null, result: RowDataPacket[]) => {
      if (err) {
        return next(err);
      }

      if (result.length === 0) {
        res
          .status(403)
          .send({ success: false, message: "No Common Groups", data: null });
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
