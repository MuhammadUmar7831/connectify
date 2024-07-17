-- case-1 (user is the last member of the group => must delete the group instead of leaving) 
-- case-2 (user is the ony admin of the group => must make someone else admin before leaving) 

-- an issue (not handled becuase currently no need) if you can now not delete all members from Members table at once but can be indirectly delete by foreign key constraint

DELIMITER //

CREATE TRIGGER leave_group
BEFORE DELETE ON Members
FOR EACH ROW
BEGIN
    DECLARE chat_type ENUM('Personal', 'Group');
    DECLARE member_count INT;
    DECLARE admin_count INT;
    DECLARE only_admin INT;

    -- Get the type of the chat
    SELECT Type INTO chat_type
    FROM Chats
    WHERE ChatId = OLD.ChatId;

    -- Only execute the rest of the logic if the chat type is 'Group'
    IF chat_type = 'Group' THEN
        -- Check if the user is the only member of the group
        SELECT COUNT(*) INTO member_count 
        FROM Members 
        WHERE ChatId = OLD.ChatId;

        IF member_count = 1 THEN
            SIGNAL SQLSTATE '45000' 
            SET MESSAGE_TEXT = 'Cannot leave the group. Please delete the group instead.';
        END IF;

        -- Check the number of admins of the group
        SELECT COUNT(*) INTO admin_count 
        FROM GroupAdmins 
        WHERE GroupId = (SELECT GroupId FROM _Groups WHERE ChatId = OLD.ChatId);
        
        IF admin_count = 1 THEN
            -- Check if that only admin is the user
            SELECT UserId INTO only_admin
            FROM GroupAdmins
            WHERE GroupId = (SELECT GroupId FROM _Groups WHERE ChatId = OLD.ChatId);
            IF only_admin = OLD.UserId THEN
                SIGNAL SQLSTATE '45000' 
                SET MESSAGE_TEXT = 'Cannot leave the group as the only admin. Please assign another admin before leaving.';
            END IF;
        END IF;
    END IF;

END //

DELIMITER ;
