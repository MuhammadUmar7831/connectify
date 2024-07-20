DELIMITER / /

CREATE TRIGGER prevent_other_chat_reply
BEFORE INSERT ON Reply
FOR EACH ROW
BEGIN
	DECLARE chatId INT;
    SET chatId = (SELECT ChatId FROM Messages WHERE MessageId = NEW.MessageId);
    IF NOT EXISTS (SELECT * FROM Messages WHERE ChatId = chatId AND  MessageId = NEW.ReplyId) THEN
	SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'You can only reply to Messages of same Chats';
    END IF;
END;