-- Updating message status for all members except sender to 'sent'

DELIMITER / /

CREATE TRIGGER TRIGGER_AFTER_UPDATE_Messages
AFTER UPDATE ON Messages
FOR EACH ROW
BEGIN
    DECLARE done INT DEFAULT FALSE;
    DECLARE userId INT; 
    DECLARE cur CURSOR FOR SELECT Members.UserId FROM Members WHERE ChatId = NEW.ChatId AND Members.UserId != NEW.SenderId;
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;
    OPEN cur;

    read_loop: LOOP
        FETCH cur INTO userId;
        IF done THEN
            LEAVE read_loop;
        END IF;

        -- Perform the insert operation for each value
        INSERT INTO MessagesStatus (UserId, MessageId, Status)
        VALUES (userId, NEW.MessageId, 'sent');

    END LOOP;

    CLOSE cur;


END//

DELIMITER;