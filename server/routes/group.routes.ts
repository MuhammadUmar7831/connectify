import { Router } from "express";
import authenticate from "../middlewares/authenticate";
import isAdmin from "../middlewares/isAdmin";
import tryCatch from "../middlewares/tryCatch";
import { addAdmin, addMemberToGroup, createGroup, deleteGroup, getCommonGroups, getGroupInfo, kickUser, leaveGroup, updateGroup } from "../controllers/group.controllers";

const router = Router();

router.get('/get/common/:friendId', authenticate, tryCatch(getCommonGroups)); //route to get all groups both users have joined (friendId is userId)
router.get('/get/info/:groupId', authenticate, tryCatch(getGroupInfo)); //route to get the info of given groupId
router.delete('/delete', authenticate, isAdmin, tryCatch(deleteGroup)); //route to delete group chats (only admins can do this)
router.delete('/kick', authenticate, isAdmin, tryCatch(kickUser)); //route to kick a user from group (only admins can do this)
router.post('/create', authenticate, tryCatch(createGroup)); //route to create a group (user who create is admin)
router.delete('/leave', authenticate, tryCatch(leaveGroup)); //route to leave a group
router.put('/update', authenticate, isAdmin, tryCatch(updateGroup)); //route to update a group (picture, name) only for admins
router.post('/add/member', authenticate, isAdmin, tryCatch(addMemberToGroup)); //route to add a user to a group (picture, name) only for admins
router.post('/add/admin', authenticate, isAdmin, tryCatch(addAdmin)); //route to add a admin to a group only for admins

export default router;
