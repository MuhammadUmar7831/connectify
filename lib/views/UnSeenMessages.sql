CREATE VIEW UnSeenMessages AS
SELECT ms.UserId, ms.MessageId, m.ChatId
FROM MessagesStatus ms
JOIN Messages m ON ms.MessageId = m.MessageId
WHERE ms.Status != 'seen';