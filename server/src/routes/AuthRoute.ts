import { Router } from "express";
import { loginUser, registerUser } from "../controllers/AuthController";
const router = Router()

router.route('/login').get(loginUser)
router.route('/register').get(registerUser)

export default router