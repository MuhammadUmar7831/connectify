import { Router } from "express";
import { getUser } from "../controllers/user.controller";
import authenticate from "../middlewares/authenticate";
import tryCatch from "../middlewares/tryCatch";

const router = Router();

router.get('/get', authenticate, tryCatch(getUser)); //route to update user profile
// router.put('/update', authenticate, tryCatch(updateProfile)); //route to update user profile
// router.delete('/delete', authenticate, tryCatch(deleteProfile)); //route to delete user profile

export default router;