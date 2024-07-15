import { NextFunction, Response } from "express";
import { authRequest } from "../middlewares/authenticate";
import connection from "../config/db";
import { QueryError, QueryResult, RowDataPacket } from "mysql2";
import errorHandler from "../errors/error";

export const createPersonalChat = async (req: authRequest, res: Response, next: NextFunction) => {
    const { content, receiverId } = req.body;

    // if (receiverId === req.userId) {
    //     return next(errorHandler(400, 'You can not send a Message to Yourself'))
    // }

    // begin transaction in case of any error rollback else commit all four queries changes
    connection.beginTransaction((err: QueryError | null) => {

        // first create a new chat of type personal 
        var sql = "INSERT INTO Chats (Type) VALUES ('Personal');";
        connection.query(sql, (err: QueryError | null, result: RowDataPacket) => {
            if (err) { return connection.rollback(() => next(err)) }

            const chatId = result.insertId;
            // second create a message which referes to the chat created
            sql = 'INSERT INTO Messages (ChatId, SenderId, Content) VALUES (?, ?, ?);';
            connection.query(sql, [chatId, req.userId, content], (err: QueryError | null, _result: QueryResult | any) => {
                if (err) { connection.rollback(() => next(err)) }

                // third create a PersonalChat
                sql = 'INSERT INTO PersonalChats (ChatId, MessageId) VALUES (?, ?);';
                connection.query(sql, [chatId, _result.insertId], (err: QueryError | null, result_: QueryResult) => {
                    if (err) { return connection.rollback(() => next(err)) }

                    // fourth add 2 members to the chat
                    sql = 'INSERT INTO Members (UserId, ChatId) VALUES (?, ?), (?, ?);';
                    connection.query(sql, [req.userId, chatId, receiverId, chatId], (err: QueryError | null, r_esult: QueryResult) => {
                        if (err) { return connection.rollback(() => next(err)) }

                        // commit and return success response if no errors else rollback
                        connection.commit((err: QueryError | null) => {
                            if (err) { return connection.rollback(() => next(err)) }

                            res.status(201).send({ success: true, message: 'Personal Chat created' });
                        })
                    })
                })
            })
        })
    })
}


export const archiveChat = async (req: authRequest, res: Response, next: NextFunction) => {
    const { chatId } = req.body;

    // case to check if the passed chat is users chat or not
    var sql = 'SELECT * FROM Chats c JOIN Members m ON c.ChatId = m.ChatId WHERE c.ChatId = ? AND m.UserId = ?;';
    connection.query(sql, [chatId, req.userId], (err: QueryError | null, result: RowDataPacket[]) => {
        if (err) { return next(err) }
        if (result.length === 0) {
            return next(errorHandler(400, 'Forbidden! Not Allowed'));
        }
    })

    // now insert the archived chat in ArchivedChats Table
    sql = 'INSERT INTO ArchivedChats (ChatId, UserId) VALUES (?, ?);';
    connection.query(sql, [chatId, req.userId], (err: QueryError | null, result: QueryResult) => {
        if (err) { return next(err) }
        res.status(201).send({ success: true, message: 'Chat Archived' })
    })
}








export const getPersonalChats = async (req: authRequest, res: Response, next: NextFunction) => {
    const userId = req.body.userId; // set by the authenticate middleware
 
    const query = `
    SELECT DISTINCT m.ChatId, u.Name, u.Avatar, u.IsActivePrivacy, mg1.*, IFNULL(received_counts.received_count, 0) AS unSeenMessages
    FROM Members m 
    JOIN Users u ON m.UserId = u.UserId
    JOIN PersonalChats pc ON pc.ChatId = m.ChatId
    JOIN Messages mg1 ON m.ChatId = mg1.ChatId
    LEFT JOIN PinnedChats pnc ON pc.ChatId = pnc.ChatId
    LEFT JOIN (
        SELECT mg2.ChatId, COUNT(*) AS received_count
        FROM Messages mg2
        JOIN MessagesStatus mgs ON mg2.MessageId = mgs.MessageId
        WHERE mgs.Status = 'received' AND mgs.UserId = ?
        GROUP BY mg2.ChatId
    ) AS received_counts ON m.ChatId = received_counts.ChatId
    WHERE m.UserId != ? 
      AND m.ChatId NOT IN (
        SELECT ChatId FROM ArchivedChats WHERE UserId = ?
      )
      AND mg1.MessageId = (
        SELECT MAX(mg2.MessageId) 
        FROM Messages mg2 
        WHERE mg2.ChatId = mg1.ChatId
    )
`;

connection.query(query, [userId, userId, userId],(err: QueryError | null, result: RowDataPacket[] )=> {
    if (err) {
        console.error('Error executing query:', err);
        return res.status(500).json({ error: 'Error executing query' });
    }

    res.status(200).json(result);
});
}


export const getGroupChats = async (req: authRequest, res: Response, next: NextFunction) => {

    const userId = req.body.userId; // set by the authenticate middleware

const query = `
 SELECT DISTINCT m.ChatId, u.Name, u.Avatar, u.IsActivePrivacy, mg1.*, IFNULL(received_counts.received_count, 0) AS unSeenMessages
    FROM Members m 
    JOIN Users u ON m.UserId = u.UserId
    JOIN GroupChats gc ON gc.ChatId = m.ChatId
    JOIN Messages mg1 ON m.ChatId = mg1.ChatId
    LEFT JOIN PinnedChats pnc ON gc.ChatId = pnc.ChatId
    LEFT JOIN (
        SELECT mg2.ChatId, COUNT(*) AS received_count
        FROM Messages mg2
        JOIN MessagesStatus mgs ON mg2.MessageId = mgs.MessageId
        WHERE mgs.Status = 'received' AND mgs.UserId = ?
        GROUP BY mg2.ChatId
    ) AS received_counts ON m.ChatId = received_counts.ChatId
    WHERE m.UserId != ? 
      AND m.ChatId NOT IN (
        SELECT ChatId FROM ArchivedChats WHERE UserId = ?
      )
      AND mg1.MessageId = (
        SELECT MAX(mg2.MessageId) 
        FROM Messages mg2 
        WHERE mg2.ChatId = mg1.ChatId
    )
`;

connection.query(query, [userId,userId,userId], (err:QueryError|null, result:RowDataPacket[]) => {
if (err) {
    console.error('Error executing query:', err);
    return res.status(500).json({ error: 'Error executing query' });
}

res.status(200).send({ success: true, message: 'Group chats retrieved successfully', data: result });
});

}
export const getArchivedChats = (req: authRequest, res: Response, next: NextFunction) => {
    const userId = req.body.userId; // set by the authenticate middleware

    const sqlQuery = `
    select distinct 
    NULL as MessageId,
        pc.ChatId as chatId, 
        (select count(mgs.MessageId)
         from MessagesStatus mgs 
         join Messages mg2 on mgs.MessageId = mg2.MessageId 
         where mgs.Status = 'received' 
         and mg2.ChatId = pc.ChatId 
         and mgs.UserId = ?) as unSeenMessages,
        ch.Type as chatType,
        u.UserId as id,
        u.Bio as description,
        NULL as groupDateCreated,
        NULL as groupdAdmin,
        mg.Content as lastMessage,
        u.Name as name, 
        u.Avatar as avatar,
        u.LastSeen as userLastSeen,
        u.IsActivePrivacy as IsActivePrivacy,
        u.IsLastSeenPrivacy as IsLastSeenPrivacy
    from ArchivedChats ac 
    join PersonalChats pc on pc.ChatId = ac.ChatId 
    join Members m on m.ChatId = pc.ChatId
    join Users u on u.UserId = m.UserId 
    join Messages mg on mg.Messageid = pc.Messageid 
    join Chats ch on ch.ChatId = pc.ChatId
    where ac.UserId = ? 
      and mg.Messageid = (select max(messageId) 
                          from Messages mg2 
                          where mg2.ChatId = pc.ChatId) 
      and u.UserId != ?

    UNION

    select distinct 
        mg.MessageId as MessageId,
        gc.ChatId as chatId,
        (select count(mgs.MessageId)
         from MessagesStatus mgs 
         join Messages mg2 on mgs.MessageId = mg2.MessageId 
         where mgs.Status = 'received' 
         and mg2.ChatId = gc.ChatId 
         and mgs.UserId = ?) as unSeenMessages,
        ch.Type as chatType,
        gr.GroupId as id,
        gr.Description as description,
        gr.DateCreated as groupDateCreated,
        u.Name as groupdAdmin,
        mg.Content as lastMessage, 
        gr.Name as name,
        gr.Avatar as avatar,
        NULL as userLastSeen,
        NULL as IsActivePrivacy,
        NULL as IsLastSeenPrivacy
    from ArchivedChats ac 
    join GroupChats gc on gc.ChatId = ac.ChatId 
    join Chats ch on ch.ChatId = ac.ChatId
    join Members m on m.ChatId = gc.ChatId 
    join _Groups gr on gr.GroupId = gc.GroupId 
    join Messages mg on mg.Messageid = gc.Messageid 
    join MessagesStatus mgs on mgs.MessageId = mg.MessageId 
    join Users u on u.UserId = gr.CreatedBy
    where ac.UserId = ? 
      and mg.Messageid = (select max(messageId) 
                          from Messages mg2 
                          where mg2.ChatId = gc.ChatId)
    group by mg.MessageId,gr.GroupId, gr.Description, gr.DateCreated, u.Name, gc.ChatId, ch.Type, mg.Content, gr.Name, gr.Avatar, gr.CreatedBy;
    `;

    connection.query(sqlQuery, [userId, userId, userId, userId, userId,userId,userId,], (err: QueryError | null, result: RowDataPacket[]) => {
        if (err) {
            return next(err);
        }
        res.status(200).send({ success: true, message: 'Archived chats retrieved successfully', data: result });
    });
}



export const getPinnedChats = (req: authRequest, res: Response, next: NextFunction) => {

    const userId = req.body.userId; // set by the authenticate middleware
    const sqlQuery = `
select distinct 
    pc.ChatId as chatId, 
    (select count(mg2.MessageId) 
     from MessagesStatus mgs 
     join Messages mg2 on mgs.MessageId = mg2.MessageId 
     where mgs.Status = 'received' 
       and mg2.ChatId = pc.ChatId 
       and mgs.UserId = ?) as unSeenMessages,
    ch.Type as chatType,
    u.UserId as id,
    u.Bio as description,
    NULL as groupDateCreated,
    NULL as groupdAdmin,
    mg.Content as lastMessage,
    u.Name as name, 
    u.Avatar as avatar,
    u.LastSeen as userLastSeen,
    u.IsActivePrivacy as IsActivePrivacy,
    u.IsLastSeenPrivacy as IsLastSeenPrivacy
from PinnedChats ac 
join PersonalChats pc on pc.ChatId = ac.ChatId 
join Members m on m.ChatId = pc.ChatId
join Users u on u.UserId = m.UserId 
join Messages mg on mg.Messageid = pc.Messageid 
join Chats ch on ch.ChatId = pc.ChatId
where ac.UserId = ?
  and mg.Messageid = (select max(messageId) 
                      from Messages mg2 
                      where mg2.ChatId = pc.ChatId) 
  and u.UserId != ?
  and pc.ChatId in (
      select distinct ac.ChatId 
      from PinnedChats ac 
      join PersonalChats pc on pc.ChatId = ac.ChatId 
      where ac.UserId = ?
  )

UNION

select distinct 
    gc.ChatId as chatId,
    (select count(mg2.MessageId) 
     from MessagesStatus mgs 
     join Messages mg2 on mgs.MessageId = mg2.MessageId 
     where mgs.Status = 'received' 
       and mg2.ChatId = gc.ChatId 
       and mgs.UserId = ?) as unSeenMessages,
    ch.Type as chatType,
    gr.GroupId as id,
    gr.Description as description,
    gr.DateCreated as groupDateCreated,
    u.Name as groupdAdmin,
    mg.Content as lastMessage, 
    gr.Name as name,
    gr.Avatar as avatar,
    NULL as userLastSeen,
    NULL as IsActivePrivacy,
    NULL as IsLastSeenPrivacy
from PinnedChats ac 
join GroupChats gc on gc.ChatId = ac.ChatId 
join Chats ch on ch.ChatId = ac.ChatId
join Members m on m.ChatId = gc.ChatId 
join _Groups gr on gr.GroupId = gc.GroupId 
join Messages mg on mg.Messageid = gc.Messageid 
join Users u on u.UserId = gr.CreatedBy
where ac.UserId = ? 
  and mg.Messageid = (select max(messageId) 
                      from Messages mg2 
                      where mg2.ChatId = gc.ChatId)
  and gc.ChatId in (
      select distinct ac.ChatId 
      from PinnedChats ac 
      join GroupChats gc on gc.ChatId = ac.ChatId 
      where ac.UserId = ?
  )
`;

    connection.query(sqlQuery, [userId,userId,userId,userId,userId,userId,userId], (err: QueryError | null, result: RowDataPacket[]) => {
        if (err) {
            return next(err);
        }
        if(result.length==0)
            res.status(404).send({ success: false, message: 'chat not Existed', data: result });

        res.status(200).send({ success: true, message: 'Archieved chats retrieved successfully', data: result });
    });
}