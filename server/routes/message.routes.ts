import { Router } from "express";
import authenticate from "../middlewares/authenticate";
import tryCatch from "../middlewares/tryCatch";
import {
  deleteMessage,
  editMessage,
  getMessageOfChats,
  sendMessage,
} from "../controllers/message.controllers";
import {
  createPersonalChatForFalseChatId,
  isChatMember,
  isMessageTimeFiveMinutes,
} from "../middlewares/message.middlewares";

const router = Router();

router.get(
  "/get/:chatId",
  authenticate,
  isChatMember,
  tryCatch(getMessageOfChats)
); //route to get messages of chats (only if user is a member of the chat)
router.post(
  "/send",
  authenticate,
  isChatMember,
  createPersonalChatForFalseChatId,
  tryCatch(sendMessage)
); //route to send messages to a chat (also include reply meesages)
router.delete(
  "/delete",
  authenticate,
  isChatMember,
  isMessageTimeFiveMinutes,
  tryCatch(deleteMessage)
); //route to delete message (with in 5 minutes after sent)
router.put(
  "/edit",
  authenticate,
  isChatMember,
  isMessageTimeFiveMinutes,
  tryCatch(editMessage)
); //route to edit message (with in 5 minutes after sent)

export default router;
