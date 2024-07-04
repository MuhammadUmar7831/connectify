CREATE TABLE Reply (
    ReplyId INT PRIMARY KEY, 
    MessageId INT,
    FOREIGN KEY (ReplyId) REFERENCES Messages(MessageId),
    FOREIGN KEY (MessageId) REFERENCES Messages(MessageId),
);
