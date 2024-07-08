import connection from "../config/db";
import { Request,Response,NextFunction } from "express";
import { authRequest } from "./authenticate";
import errorHandler from "../errors/error";
import { QueryError,RowDataPacket } from "mysql2";


const isAdmin = async(req: authRequest,res: Response,next: NextFunction)=>{
   try{
      if(!req.userId){
        return next(errorHandler(403,"Access Denied"))
      }

      const query: string = `SELECT UserId FROM GroupAdmins WHERE GroupAdmins.GroupId IN (SELECT GroupId From Groups)`
      connection.query(query,[req.userId],(err: QueryError|null, result: RowDataPacket[])=>{
        if(err){
            return next(err)
        }

        if(result.length === 0){
            return next(errorHandler(403,"Access Denied"))
        }
        next()
      })
   }
   catch(error){
    next(error)
   }
}

export default isAdmin