--case-1 (user is the last member of the group => must delete the group instead of leaving) 
--case-2 (user is the ony admin of the group => must make someone else admin before leaving) 

--an issue (not handled becuase currently no need) if you can now not delete all members from Members table at once but can be indirectly delete by foreign key constraint

DELIMITER //

CREATE TRIGGER before_member_delete
BEFORE DELETE ON Members
FOR EACH ROW
BEGIN
    DECLARE member_count INT;
    DECLARE admin_count INT;

    -- Check if the user is the only member of the group
    SELECT COUNT(*) INTO member_count 
    FROM Members 
    WHERE ChatId = OLD.ChatId;

    IF member_count <= 1 THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'Cannot leave the group. Please delete the group instead.';
    END IF;

    -- Check if the user is the only admin of the group
    SELECT COUNT(*) INTO admin_count 
    FROM GroupAdmins 
    WHERE GroupId = ( SELECT GroupId FROM _Groups WHERE ChatId = OLD.ChatId );

    IF admin_count <= 1 THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'Cannot leave the group as the only admin. Please assign another admin before leaving.';
    END IF;

END //

DELIMITER ;
