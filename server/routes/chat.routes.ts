import { Router } from "express";
import { createPersonalChat } from "../controllers/chat.controllers";
import tryCatch from "../middlewares/tryCatch";
import authenticate from "../middlewares/authenticate";

const router = Router();

// router.get('/get/personal', authenticate, tryCatch(getPersonalChats)); //route to get all personal chats (not archived chats)
// router.get('/get/group', authenticate, tryCatch(getGroupChats)); //route to get all group chats (not archived chats)
// router.get('/get/archive', authenticate, tryCatch(getArchivedChats)); //route to get all Archived chats
router.post('/create/personal', authenticate, tryCatch(createPersonalChat)); //route for creating a new chat with user (no need to be firend just send a message and chat is created)
// router.delete('/delete', authenticate, tryCatch(deleteChat)); //route for deleting chat
// router.put('/archive', authenticate, tryCatch(archiveChat)); //route for archiving chat

export default router;