CREATE TABLE GroupChats (
    ChatId INT,
    MessageId INT,
    GroupId INT,
    PRIMARY KEY (ChatId, MessageId),
    FOREIGN KEY (ChatId) REFERENCES Chats(ChatId),
    FOREIGN KEY (MessageId) REFERENCES Messages(MessageId),
    FOREIGN KEY (GroupId) REFERENCES Groups(GroupId)
);
