import { Router } from "express";
import verifyUser from '../middleware/VerifyUser'
import { accessChat,fetchChats,createGroupChat, renameGroup,removeFromGroup,addToGroup} from "../controllers/ChatController";
const router = Router();

router.route("/").post(verifyUser, accessChat);
router.route("/").get(verifyUser, fetchChats);
router.route("/group").post(verifyUser, createGroupChat);
router.route("/rename").put(verifyUser, renameGroup);
router.route("/groupremove").put(verifyUser, removeFromGroup);
router.route("/groupadd").put(verifyUser, addToGroup);

export default router