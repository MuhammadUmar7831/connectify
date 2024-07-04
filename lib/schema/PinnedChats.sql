CREATE TABLE PinnedChats (
    ChatId INT,
    UserId INT,
    PRIMARY KEY (ChatId, UserId),
    FOREIGN KEY (ChatId) REFERENCES Chats(ChatId),
    FOREIGN KEY (UserId) REFERENCES Users(UserId)
);
