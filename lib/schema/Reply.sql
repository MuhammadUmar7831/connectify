CREATE TABLE Reply (
    ReplyId INT, 
    MessageId INT,
    PRIMARY KEY (ReplyId, MessageId),
    FOREIGN KEY (ReplyId) REFERENCES Messages(MessageId),
    FOREIGN KEY (MessageId) REFERENCES Messages(MessageId),
);
