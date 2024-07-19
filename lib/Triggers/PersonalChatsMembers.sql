-- PURPOSE
-- -This trigger is used to prevent two same users from having more than one PersonalChat

-- APPROACH
-- 1- Get the second user of the inserted chatId in the Members table. Ensure that the chatId is from the PersonalChat table.
-- 2- Get the count of ChatIds from the Members table that are also PersonalChatIds and involve both the same first user (who is inserted) and the second user (identified in First Step).
-- 3- If the count is greater than 1, the trigger will not allow the insertion of the same users who already have one PersonalChatId


DELIMITER //

CREATE TRIGGER before_insert_Members
BEFORE INSERT ON Members
FOR EACH ROW
BEGIN
    DECLARE chatCount INT DEFAULT 0;
    DECLARE secondUser INT;
    
    -- Retrieve the second user from the Members table
    SELECT mb.UserId INTO secondUser 
    FROM Members mb 
    WHERE mb.ChatId IN (
        SELECT ChatId 
        FROM PersonalChats pc 
        WHERE pc.ChatId = mb.ChatId AND pc.ChatId = NEW.ChatId
    ) AND mb.UserId != NEW.UserId;
    
    -- If secondUser is not null, then count the number of personal chats
    IF secondUser IS NOT NULL THEN 
        SELECT COUNT(DISTINCT mb.ChatId) INTO chatCount 
        FROM Members mb
        WHERE mb.ChatId IN (
            SELECT ChatId 
            FROM PersonalChats pc 
            WHERE pc.ChatId = mb.ChatId 
              AND (mb.UserId = NEW.UserId OR mb.UserId = secondUser)
        );
    END IF;

    -- If there is already a chat, prevent the insertion
    IF chatCount > 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Users already have a personal chat';
    END IF;
END;
//

DELIMITER ;
