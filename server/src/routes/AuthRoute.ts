import { Router } from "express";
import upload from '../middleware/Multer'
import { getAllUsers, loginUser, registerUser } from "../controllers/AuthController";
import verifyUser from "../middleware/VerifyUser";
const router = Router()

router.route('/login').post( loginUser)
router.route('/register').post(upload.fields([{ name: 'avatar', maxCount: 1 }]),registerUser)
router.route('/alluser').post(verifyUser,getAllUsers)
export default router