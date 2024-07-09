import { NextFunction, Request, Response } from "express";
import { QueryError, QueryResult, RowDataPacket} from "mysql2";
import connection from "../config/db";
import errorHandler from "../errors/error";
import { authRequest } from "../middlewares/authenticate";

export const deleteGroup = async (req: authRequest, res: Response, next: NextFunction) => {
  const groupId = req.body;
  const query = `DELETE FROM _Groups WHERE GroupId = ?;`;
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

export const getCommonGroups = async (req: authRequest, res: Response, next: NextFunction)=>{
  const friendId = req.params.friendId
  const userId = req.userId

  const query = `SELECT * FROM _Groups g JOIN GroupChats gc on g.GroupId = gc.GroupId JOIN Members m1 on gc.chatId = m1.chatId JOIN Members m2 on gc.chatId = m2.chatId WHERE m1.userId = ? AND m2.userId = ?;`
  const values = [friendId,userId]
  connection.query(query,values,(err: QueryError|null, result: RowDataPacket[])=>{
      if(err){
        return next(err)
      }

      if(result.length === 0){
        res.status(403).send({success: false, message: "No Common Groups", data: null})
      }

      res.status(200).send({success: true, message:"Common Groups Found" , data: result})
  })
}
