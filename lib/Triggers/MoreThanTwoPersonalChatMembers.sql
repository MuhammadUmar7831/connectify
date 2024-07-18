DELIMITER //

CREATE TRIGGER check_personal_chat_members
BEFORE INSERT ON Members
FOR EACH ROW
BEGIN
    DECLARE chat_type ENUM('Personal', 'Group');
    DECLARE member_count INT;

    -- Get the type of the chat
    SELECT Type INTO chat_type
    FROM Chats
    WHERE ChatId = NEW.ChatId;

    -- If the chat is personal, count the number of members
    IF chat_type = 'Personal' THEN
        SELECT COUNT(*) INTO member_count
        FROM Members
        WHERE ChatId = NEW.ChatId;

        -- If there are already 2 members, raise an error
        IF member_count = 2 THEN
            SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'A personal chat can only have 2 members';
        END IF;
    END IF;
END;
//

DELIMITER ;
