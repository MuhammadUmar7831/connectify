CREATE TABLE PinnedMessages (
    MessageId INT PRIMARY KEY,
    FOREIGN KEY (MessageId) REFERENCES Messages(MessageId)
);
