CREATE VIEW ChatMessages AS
SELECT 
    m.*, 
    sender.Name AS Sender,
    JSON_ARRAYAGG(JSON_OBJECT('UserId', ms.UserId, 'UserName', u.Name, 'Status', ms.Status)) AS UserStatus,
    reply.ReplyId, 
    reply.ReplyContent,
    reply.ReplySenderId,
	reply.ReplySender 
FROM Messages m
LEFT JOIN MessagesStatus ms ON m.MessageId = ms.MessageId
LEFT JOIN Users sender ON m.SenderId = sender.UserId
JOIN Users u ON ms.UserId = u.UserId 
LEFT JOIN (
    SELECT 
        r.ReplyId,
		replySender.UserId AS ReplySenderId,
        replySender.Name AS ReplySender,
        m.MessageId,
        rm.Content AS ReplyContent
    FROM Reply r
    JOIN Messages m ON r.MessageId = m.MessageId
    JOIN Messages rm ON r.ReplyId = rm.MessageId
    JOIN Users replySender ON rm.SenderId = replySender.UserId
) AS reply ON m.MessageId = reply.MessageId
GROUP BY 
    m.MessageId, 
    reply.ReplyId, 
    reply.ReplyContent
ORDER BY Timestamp DESC;
