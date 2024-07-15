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
    WHERE mgs.Status = 'received' AND mgs.UserId = 1
    GROUP BY mg2.ChatId
) AS received_counts ON m.ChatId = received_counts.ChatId
WHERE m.UserId != 1 
  AND m.ChatId NOT IN (
    SELECT ChatId FROM ArchivedChats WHERE UserId = 1
  )
  AND mg1.MessageId = (
    SELECT MAX(mg2.MessageId) 
    FROM Messages mg2 
    WHERE mg2.ChatId = mg1.ChatId
  );
  

SELECT DISTINCT m.ChatId, u.Name, u.Avatar, u.IsActivePrivacy, mg_all.*, IFNULL(received_counts.received_count, 0) AS unSeenMessages
FROM Members m 
JOIN Users u ON m.UserId = u.UserId
JOIN PersonalChats pc ON pc.ChatId = m.ChatId
LEFT JOIN (
	SELECT mg1.ChatId, max(mg1.MessageId) AS MessageId
    FROM Messages mg1
    GROUP BY ChatId
) AS mg ON m.ChatId = mg.ChatId
JOIN Messages mg_all ON mg.MessageId = mg_all.MessageId
LEFT JOIN PinnedChats pnc ON pc.ChatId = pnc.ChatId
LEFT JOIN (
    SELECT mg2.ChatId, COUNT(*) AS received_count
    FROM Messages mg2
    JOIN MessagesStatus mgs ON mg2.MessageId = mgs.MessageId
    WHERE mgs.Status = 'received' AND mgs.UserId = 1
    GROUP BY mg2.ChatId
) AS received_counts ON m.ChatId = received_counts.ChatId
WHERE m.UserId != 1 
  AND m.ChatId NOT IN (
    SELECT ChatId FROM ArchivedChats WHERE UserId = 1
  );