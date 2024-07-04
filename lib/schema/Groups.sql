CREATE TABLE Groups (
    GroupId INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(255) NOT NULL,
    Avatar VARCHAR(255) NOT NULL,
    Description VARCHAR(255) NULL,
    DateCreated Date NOT NULL,
    CreatedBy INT NOT NULL,
    FOREIGN KEY (CreatedBy) REFERENCES Users(UserId)
);
