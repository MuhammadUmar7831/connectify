CREATE TABLE ArchivedChats (
    ChatId INT,
    UserId INT,
    PRIMARY KEY (ChatId, UserId), 
    FOREIGN KEY (ChatId) REFERENCES Chats(ChatId) ON DELETE CASCADE,
    FOREIGN KEY (UserId) REFERENCES Users(UserId) ON DELETE CASCADE
);
