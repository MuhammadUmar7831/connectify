CREATE TABLE GroupChats (
    ChatId INT,
    MessageId INT,
    PRIMARY KEY (ChatId, MessageId),
    FOREIGN KEY (ChatId) REFERENCES Chats(ChatId),
    FOREIGN KEY (MessageId) REFERENCES Messages(MessageId)
);
