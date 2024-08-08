CREATE VIEW LastMessagesOfChat AS
SELECT mg.* 
FROM Messages mg
JOIN MessageStatusView msv ON mg.MessageId = msv.MessageId
WHERE mg.MessageId IN (
    SELECT MAX(m.MessageId) 
    FROM Messages m
    GROUP BY m.ChatId
);