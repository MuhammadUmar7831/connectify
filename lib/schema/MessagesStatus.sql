CREATE TABLE MessagesStatus (
    UserId INT,
    MessageId INT,
    Status ENUM('sent', 'received', 'seen') NOT NULL,
    PRIMARY KEY(UserId, MessageId),
    FOREIGN KEY (UserId) REFERENCES Users(UserId) ON DELETE CASCADE,
    FOREIGN KEY (MessageId) REFERENCES Messages(MessageId) ON DELETE CASCADE
);
