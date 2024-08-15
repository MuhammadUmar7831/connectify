import { Router } from "express";
import { signin, signup, signout } from "../controllers/auth.controllers";
import tryCatch from "../middlewares/tryCatch";

const router = Router();

router.post("/signup", tryCatch(signup)); //route for sign up
router.post("/signin", tryCatch(signin)); //route for sign in
router.post("/signout", tryCatch(signout)); //route for sign out
// router.delete('/signout/:userId', authenticate, tryCatch(signout)); //route for sign in
// router.get('/get', authenticate, tryCatch(getUser)); //route for getting user

export default router;
