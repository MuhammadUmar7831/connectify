export const getPersonalChatQuery = `
    SELECT DISTINCT 
    c.ChatId,
    u.Name, 
    u.Avatar, 
    CASE 
        WHEN mg_all.SenderId = ? THEN 'You' 
        ELSE u.Name 
    END AS SenderName,
    mg_all.MessageId, 
    mg_all.SenderId, 
    mg_all.Content, 
    mg_all.TimeStamp, 
    IFNULL(received_counts.received_count, 0) AS unSeenMessages
    FROM Chats c
    LEFT JOIN Members m ON c.ChatId = m.ChatId
    LEFT JOIN Users u ON m.UserId = u.UserId
    LEFT JOIN (
        SELECT mg1.ChatId, max(mg1.MessageId) AS MessageId
        FROM Messages mg1
        GROUP BY ChatId
    ) AS mg ON c.ChatId = mg.ChatId
    LEFT JOIN Messages mg_all ON mg.MessageId = mg_all.MessageId
    LEFT JOIN (
        SELECT mg2.ChatId, COUNT(*) AS received_count
        FROM Messages mg2
        JOIN MessagesStatus mgs ON mg2.MessageId = mgs.MessageId
        WHERE (mgs.Status = 'received' OR mgs.Status = 'sent') AND mgs.UserId = ?
        GROUP BY mg2.ChatId
    ) AS received_counts ON c.ChatId = received_counts.ChatId
    WHERE 
    c.Type = 'Personal' AND
    u.UserId != ?`;

export const getGroupChatsQuery = `
    SELECT DISTINCT 
    g.ChatId,
    g.Name, 
    g.Avatar, 
    CASE 
        WHEN mg_all.SenderId = ? THEN 'You' 
        ELSE u.Name 
    END AS SenderName,
    mg_all.MessageId, 
    mg_all.SenderId, 
    mg_all.Content, 
    mg_all.TimeStamp, 
    IFNULL(received_counts.received_count, 0) AS unSeenMessages
    FROM _Groups g
    LEFT JOIN (
        SELECT mg1.ChatId, max(mg1.MessageId) AS MessageId
        FROM Messages mg1
        GROUP BY ChatId
    ) AS mg ON g.ChatId = mg.ChatId
    LEFT JOIN Messages mg_all ON mg.MessageId = mg_all.MessageId
    LEFT JOIN Users u ON mg_all.SenderId = u.UserId
    LEFT JOIN (
        SELECT mg2.ChatId, COUNT(*) AS received_count
        FROM Messages mg2
        JOIN MessagesStatus mgs ON mg2.MessageId = mgs.MessageId
        WHERE (mgs.Status = 'received' OR mgs.Status = 'sent') AND mgs.UserId = ?
        GROUP BY mg2.ChatId
    ) AS received_counts ON g.ChatId = received_counts.ChatId
    `;