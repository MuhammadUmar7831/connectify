import { Router } from 'express';
import { archiveChat, createPersonalChat, getPersonalChats, getGroupChats, getArchivedChats, getPinnedChats, unArchiveChat, pinChat, unPinChat } from "../controllers/chat.controllers";
import tryCatch from "../middlewares/tryCatch";
import authenticate from "../middlewares/authenticate";
import isMember from '../middlewares/isMember';

const router = Router();

router.get('/get/personal', authenticate, tryCatch(getPersonalChats)); //route to get all personal chats (not archived chats)
router.get('/get/group', authenticate, tryCatch(getGroupChats)); //route to get all group chats (not archived chats)
router.get('/get/archive', authenticate, tryCatch(getArchivedChats)); //route to get all Archived chats
router.get('/get/pinned', authenticate, tryCatch(getPinnedChats)); //route to get all Archived chats
router.post('/create/personal', authenticate, tryCatch(createPersonalChat)); //route for creating a new chat with user (no need to be firend just send a message and chat is created)
// router.delete('/delete', authenticate, tryCatch(deleteChat)); //route for deleting chat
router.put('/archive', authenticate, tryCatch(archiveChat)); //route for archiving chat
router.delete('/unArchive', authenticate, tryCatch(unArchiveChat)); //route for unArchiving chat
router.put('/pin', authenticate, tryCatch(isMember), tryCatch(pinChat)); //route for pinning chat
router.delete('/unPin', authenticate, tryCatch(isMember), tryCatch(unPinChat)); //route for unArchiving chat

export default router;