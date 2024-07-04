CREATE TABLE Chats (
    ChatId INT AUTO_INCREMENT PRIMARY KEY,
    Type ENUM('Personal', 'Group') NOT NULL,
    MemberId INT,
    FOREIGN KEY (MemberId) REFERENCES Members(MemberId)
);
