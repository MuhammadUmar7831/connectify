CREATE TABLE Members (
    UserId INT,
    ChatId INT,
    PRIMARY KEY(UserId, ChatId)
    FOREIGN KEY (UserId) REFERENCES Users(UserId),
    FOREIGN KEY (ChatId) REFERENCES Chats(ChatId)
);
