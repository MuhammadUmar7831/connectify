import { Router } from "express";
import { getFriendInfo, getUser, search } from "../controllers/user.controller";
import authenticate from "../middlewares/authenticate";
import tryCatch from "../middlewares/tryCatch";

const router = Router();

router.get('/get', authenticate, tryCatch(getUser)); //route to info user profile (logged in user)
router.get('/get/info/:friendId', tryCatch(getFriendInfo)); //route to get info of friend
// router.get('/search/includeChatId', authenticate, tryCatch(searchWithChat)); //route to search user excpet the users given in body
router.post('/search', tryCatch(search)); //route to search user excpet the users given in body
// router.put('/update', authenticate, tryCatch(updateProfile)); //route to update user profile
// router.delete('/delete', authenticate, tryCatch(deleteProfile)); //route to delete user profile

export default router;