CREATE TABLE StarredMessages (
    UserId INT,
    MessageId INT,
    PRIMARY KEY (ChatId, UserId),
    FOREIGN KEY (UserId) REFERENCES Users(UserId),
    FOREIGN KEY (MessageId) REFERENCES Messages(MessageId),
);
