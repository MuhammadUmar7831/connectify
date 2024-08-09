const query = `
SELECT 
    c.Type,
    CASE
        WHEN c.Type = 'Group' THEN g.GroupId
        ELSE (
            SELECT u.UserId
            FROM Users u
            JOIN Members m ON u.UserId = m.UserId
            WHERE m.ChatId = c.ChatId AND u.UserId != ?
            LIMIT 1
        )
    END AS InfoId,
    CASE
        WHEN c.Type = 'Group' THEN g.Name
        ELSE (
            SELECT u.Name
            FROM Users u
            JOIN Members m ON u.UserId = m.UserId
            WHERE m.ChatId = c.ChatId AND u.UserId != ?
            LIMIT 1
        )
    END AS ChatName,
    CASE
        WHEN c.Type = 'Group' THEN g.Avatar
        ELSE (
            SELECT u.Avatar
            FROM Users u
            JOIN Members m ON u.UserId = m.UserId
            WHERE m.ChatId = c.ChatId AND u.UserId != ?
            LIMIT 1
        )
    END AS ChatAvatar,
    JSON_ARRAYAGG(
        JSON_OBJECT(
            'UserId', u.UserId,
            'Name', u.Name, 
            'Avatar', u.Avatar, 
            'LastSeen', u.LastSeen, 
            'IsLastSeenPrivacy', u.IsLastSeenPrivacy, 
            'IsActivePrivacy', u.IsActivePrivacy
        )
    ) AS Members
FROM Chats c
LEFT JOIN _Groups g ON c.ChatId = g.ChatId
LEFT JOIN Members m ON c.ChatId = m.ChatId
LEFT JOIN Users u ON m.UserId = u.UserId
WHERE c.ChatId = ? AND u.UserId != ?
GROUP BY c.ChatId, c.Type, g.Name, g.Avatar;
`

export default query;
