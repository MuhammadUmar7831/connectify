import { Router } from "express";

const router = Router();

// router.get('/get/common/:friendId', authenticate, tryCatch(getCommonGroups)); //route to get all groups both users have joined (friendId is userId)
// router.delete('/delete', authenticate, isAdmin, tryCatch(deleteGroup)); //route to delete group chats (only admin can do this)
// router.delete('/kick', authenticatem isAdmin, tryCatch(kickUser)); //route to kick a user from group (only admin can do this)
// router.post('/create', authenticate, tryCatch(createGroup)); //route to create a group (user who create is admin)

export default router;