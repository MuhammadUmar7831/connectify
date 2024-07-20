DELIMITER / /

CREATE TRIGGER TRIGGER_AFTER_UPDATE_Messages
AFTER UPDATE ON Messages
FOR EACH ROW
BEGIN
    DECLARE done INT DEFAULT FALSE;
    DECLARE UserId INT; -- Adjust the data type as needed
    DECLARE cur CURSOR FOR SELECT UserId FROM Members WHERE ChatId = NEW.ChatId AND UserId != NEW.SenderId;
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;
    OPEN cur;

    read_loop: LOOP
        FETCH cur INTO UserId;
        IF done THEN
            LEAVE read_loop;
        END IF;

        -- Perform the insert operation for each value
        INSERT INTO MessagesStatus (UserId, MessageId, Status)
        VALUES (UserId, NEW.MessageId, 'sent');

    END LOOP;

    CLOSE cur;
    
END //

DELIMITER;