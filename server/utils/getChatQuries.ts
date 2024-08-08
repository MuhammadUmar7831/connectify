export const getPersonalChatQuery = `
    SELECT 
        otherUser.UserId, otherUser.Name, otherUser.Avatar,
        mg.ChatId, mg.MessageId, mg.SenderId, mg.Content, mg.Timestamp,
        msv.Status,
        sender.Name as SenderName,
        (
            SELECT count(*) FROM UnSeenMessages usm 
            WHERE usm.ChatId = c.ChatId AND usm.UserId = u.UserId
        ) AS unSeenMessages
    FROM Chats c
    JOIN Members m ON c.ChatId = m.ChatId
    JOIN Users u ON m.UserId = u.UserId
    JOIN Members other ON (c.ChatId = other.ChatId AND other.UserId != u.UserId)
    JOIN Users otherUser ON other.UserId = otherUser.UserId
    LEFT JOIN LastMessagesOfChat mg ON c.ChatId = mg.ChatId
    LEFT JOIN Users sender ON mg.SenderId = sender.UserId
    LEFT JOIN MessageStatusView msv ON mg.MessageId = msv.MessageId
    WHERE m.UserId = ? AND 
    c.Type = 'personal'`;

export const getGroupChatsQuery = `
    SELECT 
        null AS UserId, 
        g.Name, g.Avatar, g.ChatId,
        mg.MessageId, mg.SenderId, mg.Content, mg.Timestamp, 
        msv.Status, sender.Name as SenderName,
        (
            SELECT count(*) FROM UnSeenMessages usm 
            WHERE usm.ChatId = c.ChatId AND usm.UserId = u.UserId
        ) AS unSeenMessages
    FROM Chats c
    JOIN Members m ON c.ChatId = m.ChatId
    JOIN Users u ON m.UserId = u.UserId
    JOIN _Groups g ON g.ChatId = c.ChatId 
    LEFT JOIN LastMessagesOfChat mg ON c.ChatId = mg.ChatId
    LEFT JOIN Users sender ON mg.SenderId = sender.UserId
    LEFT JOIN MessageStatusView msv ON mg.MessageId = msv.MessageId
    WHERE m.UserId = ?`;