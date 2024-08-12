CREATE VIEW MessageStatusView AS
SELECT 
    MessageId,
   JSON_ARRAYAGG(JSON_OBJECT('UserId', ms.UserId, 'UserName', u.Name, 'Status', ms.Status)) AS UserStatus
FROM MessagesStatus ms
JOIN Users u ON ms.UserId = u.UserId
GROUP BY 
    MessageId;
