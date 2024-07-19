-- Purpose
--      This trigger will prevent to insert a reply for message and that message is again the same (reply is a message which is this message itself)

DELIMITER //

CREATE TRIGGER prevent_itself_reply
BEFORE INSERT ON Reply
FOR EACH ROW
BEGIN
    IF New.ReplyId = New.MessageId THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'A Message can not be a Reply of itself';
    END IF;
END //

DELIMITER ;
