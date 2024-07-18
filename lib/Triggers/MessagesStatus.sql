-- PURPOSE
-- This trigger is used to prevent a user (who sends the message) from setting their own Message Status (received, sent, seen).
-- APPROACH
-- 1- Get the senderId (who sent the message) of the inserted MessageId in the MessagesStatus table.
-- 2- Compare the senderId identified above with the userId in the MessagesStatus table who inserted the status of the message.
-- 3 -If both IDs are the same, it means the user inserted their own message status; therefore, the trigger will not allow the insertion.


DELIMITER //

CREATE TRIGGER before_insert_MessagesStatus
BEFORE INSERT ON MessagesStatus
FOR EACH ROW
BEGIN
    DECLARE senderId INT;
    
    -- Retrieve the sender ID of the message
    SELECT mg.SenderId INTO senderId 
    FROM Messages mg 
    WHERE mg.MessageId = NEW.MessageId;
    
    -- Check if the user trying to insert the status is the same as the sender
    IF NEW.UserId = senderId THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Cannot store status for the user who sent the message';
    END IF;
END;
//

DELIMITER ;
