-- Purpose:
--      Prevent inserting status for users who are not members of the chat for the message being inserted

-- Approach:
--      1. Declare a variable is_member to store the result of the membership check.
--      2. Use a SELECT COUNT(*) query to check if the user is a member of the chat.
--      3. If the user is not a member (is_member = 0), raise an error using SIGNAL.

DELIMITER //
CREATE TRIGGER prevent_non_member_message_status
BEFORE INSERT ON MessagesStatus
FOR EACH ROW
BEGIN
    DECLARE is_member INT;

    SELECT COUNT(*)
    INTO is_member
    FROM Members mb
    JOIN Messages m ON mb.ChatId = m.ChatId
    WHERE m.MessageId = NEW.MessageId
    AND mb.UserId = NEW.UserId;

    IF is_member = 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'User is not a member of the chat of the inserted message, cannot add message status';
    END IF;
END //
DELIMITER ;
