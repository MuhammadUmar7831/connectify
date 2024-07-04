CREATE TABLE PersonalChats (
    ChatId INT,
    MessageId INT,
    PRIMARY KEY (ChatId, MessageId),
    FOREIGN KEY (ChatId) REFERENCES Chats(ChatId),
);
