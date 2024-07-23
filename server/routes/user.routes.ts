import { Router } from "express";
import { getFriendInfo, getUser } from "../controllers/user.controller";
import authenticate from "../middlewares/authenticate";
import tryCatch from "../middlewares/tryCatch";

const router = Router();

router.get('/get', authenticate, tryCatch(getUser)); //route to info user profile (logged in user)
router.get('/get/info/:friendId', tryCatch(getFriendInfo)); //route to get info of friend
// router.put('/update', authenticate, tryCatch(updateProfile)); //route to update user profile
// router.delete('/delete', authenticate, tryCatch(deleteProfile)); //route to delete user profile

export default router;