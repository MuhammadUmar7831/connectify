CREATE TABLE GroupAdmins (
    UserId INT,
    GroupId INT,
    PRIMARY KEY (UserId, GroupId),
    FOREIGN KEY (UserId) REFERENCES Users(UserId),
    FOREIGN KEY (GroupId) REFERENCES Groups(GroupId)
);
