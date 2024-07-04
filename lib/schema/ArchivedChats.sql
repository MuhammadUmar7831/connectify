CREATE TABLE ArchivedChats (
    ChatId INT PRIMARY KEY,
    FOREIGN KEY (ChatId) REFERENCES Chats(ChatId),
);
