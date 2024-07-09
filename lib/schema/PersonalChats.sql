CREATE TABLE PersonalChats (
    ChatId INT,
    MessageId INT,
    PRIMARY KEY (ChatId, MessageId),
    FOREIGN KEY (ChatId) REFERENCES Chats(ChatId) ON DELETE CASCADE,
    FOREIGN KEY (MessageId) REFERENCES Messages(MessageId) ON DELETE CASCADE
);
