import { Router } from "express";
import authenticate from "../middlewares/authenticate";
import tryCatch from "../middlewares/tryCatch";
import { getMessageOfChats } from "../controllers/message.controllers";
import isChatMember from "../middlewares/isChatMember";

const router = Router();

router.get(
  "/get/:chatId",
  authenticate,
  isChatMember,
  tryCatch(getMessageOfChats)
); //route to get messages of chats (only if user is a member of the chat)
// router.post('/send', authenticate, tryCatch(getMessageOfChats)); //route to send messages to a chat (also include reply meesages)
// router.delete('/delete', authenticate, tryCatch(deleteMessage)); //route to delete message (with in 5 minutes after sent)
// router.put('/edit', authenticate, tryCatch(editMessage)); //route to edit message (with in 5 minutes after sent)

export default router;
