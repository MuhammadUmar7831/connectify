CREATE TABLE GroupAdmins (
    UserId INT,
    GroupId INT UNIQUE,
    PRIMARY KEY (UserId, GroupId),
    FOREIGN KEY (UserId) REFERENCES Users(UserId) ON DELETE CASCADE,
    FOREIGN KEY (GroupId) REFERENCES _Groups(GroupId) ON DELETE CASCADE
);
