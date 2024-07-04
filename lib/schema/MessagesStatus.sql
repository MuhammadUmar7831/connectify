CREATE TABLE MessagesStaus (
    UserId INT,
    MessageId INT,
    Status ENUM('sent', 'received', 'seen') NOT NULL,
    FOREIGN KEY (UserId) REFERENCES Users(UserId),
    FOREIGN KEY (MessageId) REFERENCES Messages(MessageId)
);
