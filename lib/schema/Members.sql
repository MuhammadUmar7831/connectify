CREATE TABLE Members (
    MemberId INT AUTO_INCREMENT PRIMARY KEY,
    UserId INT,
    ChatId INT,
    FOREIGN KEY (UserId) REFERENCES Users(UserId),
    FOREIGN KEY (ChatId) REFERENCES Chats(ChatId)
);
