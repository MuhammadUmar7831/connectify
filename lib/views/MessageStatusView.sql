CREATE VIEW MessageStatusView AS
SELECT 
    MessageId,
    CASE
        WHEN SUM(CASE WHEN Status = 'sent' THEN 1 ELSE 0 END) > 0 THEN 'sent'
        WHEN SUM(CASE WHEN Status = 'received' THEN 1 ELSE 0 END) > 0 THEN 'received'
        ELSE 'seen'
    END AS Status
FROM 
    MessagesStatus
GROUP BY 
    MessageId;
