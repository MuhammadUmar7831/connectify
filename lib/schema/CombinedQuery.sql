CREATE TABLE Users (
    UserId INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(255) NOT NULL,
    Email VARCHAR(255) UNIQUE NOT NULL,
    Password VARCHAR(255) NOT NULL,
    Avatar VARCHAR(255) NOT NULL,
    Bio TEXT NOT NULL,
    LastSeen TIMESTAMP,
    IsActivePrivacy BOOLEAN DEFAULT 0,
    IsLastSeenPrivacy BOOLEAn DEFAULT 0
);
CREATE TABLE ArchivedChats (
    ChatId INT PRIMARY KEY,
    FOREIGN KEY (ChatId) REFERENCES Chats(ChatId),
);
CREATE TABLE Chats (
    ChatId INT AUTO_INCREMENT PRIMARY KEY,
    Type ENUM('Personal', 'Group') NOT NULL
);
CREATE TABLE GroupAdmins (
    UserId INT,
    GroupId INT,
    PRIMARY KEY (UserId, GroupId),
    FOREIGN KEY (UserId) REFERENCES Users(UserId),
    FOREIGN KEY (GroupId) REFERENCES Groups(GroupId)
);
CREATE TABLE GroupChats (
    ChatId INT,
    MessageId INT,
    GroupId INT,
    PRIMARY KEY (ChatId, MessageId),
    FOREIGN KEY (ChatId) REFERENCES Chats(ChatId),
    FOREIGN KEY (GroupId) REFERENCES Groups(GroupId)
);
CREATE TABLE Groups (
    GroupId INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(255) NOT NULL,
    Avatar VARCHAR(255) NOT NULL,
    Description VARCHAR(255) NULL,
    DateCreated Date NOT NULL,
    CreatedBy INT NOT NULL,
    FOREIGN KEY (CreatedBy) REFERENCES Users(UserId)
);
CREATE TABLE Members (
    UserId INT,
    ChatId INT,
    PRIMARY KEY(UserId, ChatId)
    FOREIGN KEY (UserId) REFERENCES Users(UserId),
    FOREIGN KEY (ChatId) REFERENCES Chats(ChatId)
);
CREATE TABLE Messages (
    MessageId INT AUTO_INCREMENT PRIMARY KEY,
    ChatId INT,
    SenderId INT,
    Content TEXT NOT NULL,
    Timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ChatId) REFERENCES Chats(ChatId),
    FOREIGN KEY (SenderId) REFERENCES Users(UserId)
);
CREATE TABLE MessagesStaus (
    UserId INT,
    MessageId INT,
    Status ENUM('sent', 'received', 'seen') NOT NULL,
    FOREIGN KEY (UserId) REFERENCES Users(UserId),
    FOREIGN KEY (MessageId) REFERENCES Messages(MessageId)
);
CREATE TABLE PersonalChats (
    ChatId INT,
    MessageId INT,
    PRIMARY KEY (ChatId, MessageId),
    FOREIGN KEY (ChatId) REFERENCES Chats(ChatId),
);
CREATE TABLE PinnedChats (
    ChatId INT,
    UserId INT,
    PRIMARY KEY (ChatId, UserId),
    FOREIGN KEY (ChatId) REFERENCES Chats(ChatId),
    FOREIGN KEY (UserId) REFERENCES Users(UserId)
);
CREATE TABLE PinnedMessages (
    MessageId INT PRIMARY KEY,
    FOREIGN KEY (MessageId) REFERENCES Messages(MessageId)
);
CREATE TABLE Reply (
    ReplyId INT PRIMARY KEY, 
    MessageId INT,
    FOREIGN KEY (ReplyId) REFERENCES Messages(MessageId),
    FOREIGN KEY (MessageId) REFERENCES Messages(MessageId),
);
CREATE TABLE StarredMessages (
    UserId INT,
    MessageId INT,
    PRIMARY KEY (ChatId, UserId),
    FOREIGN KEY (UserId) REFERENCES Users(UserId),
    FOREIGN KEY (MessageId) REFERENCES Messages(MessageId),
);
