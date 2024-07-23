DELIMITER //

CREATE TRIGGER prevent_other_chat_reply
BEFORE INSERT ON Reply
FOR EACH ROW
BEGIN
    DECLARE chatId INT;
    DECLARE replyChatId INT;

    SELECT ChatId INTO chatId FROM Messages WHERE MessageId = NEW.MessageId;

    SELECT ChatId INTO replyChatId FROM Messages WHERE MessageId = NEW.ReplyId;

    IF chatId != replyChatId THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'You can only reply to Messages of the same Chat';
    END IF;
END//
DELIMITER ;