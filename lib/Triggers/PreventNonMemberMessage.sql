-- Purpose:
--      Prevent user from sending a message in a chat of which the sender is not a member

-- Approach:
--      Select From Members Table Where User and Chat Matches with the inserted one 
--      if count is 1 it means user is member otherwise User is not member

DELIMITER //

CREATE TRIGGER prevent_non_member_message
BEFORE INSERT ON Messages
FOR EACH ROW
BEGIN
    DECLARE isMember INT;

    SELECT COUNT(*)
    INTO isMember
    FROM Members mb
    WHERE mb.ChatId = NEW.ChatId
    AND mb.UserId = NEW.SenderId;

    IF isMember = 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'User (Sender) is not a member of the chat, cannot send a message';
    END IF;
END //

DELIMITER ;
