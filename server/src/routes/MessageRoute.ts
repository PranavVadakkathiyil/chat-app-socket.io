import { Router } from "express";
import verifyUser from "../middleware/VerifyUser";
import { allMessages,sendMessage } from "../controllers/MessageController";
const router = Router()
router.route("/:chatId").get(verifyUser, allMessages);
router.route("/").post(verifyUser, sendMessage);

export default router