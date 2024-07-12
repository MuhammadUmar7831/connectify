CREATE TABLE GroupChats (
    ChatId INT,
    MessageId INT,
    GroupId INT,
    PRIMARY KEY (ChatId, MessageId),
    FOREIGN KEY (ChatId) REFERENCES Chats(ChatId) on delete cascade,
    FOREIGN KEY (MessageId) REFERENCES Messages(MessageId) on delete cascade,
    FOREIGN KEY (GroupId) REFERENCES Groups(GroupId) on delete cascade
);
