"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Multer_1 = __importDefault(require("../middleware/Multer"));
const AuthController_1 = require("../controllers/AuthController");
const VerifyUser_1 = __importDefault(require("../middleware/VerifyUser"));
const router = (0, express_1.Router)();
router.route('/login').post(AuthController_1.loginUser);
router.route('/register').post(Multer_1.default.fields([{ name: 'avatar', maxCount: 1 }]), AuthController_1.registerUser);
router.route('/alluser').post(VerifyUser_1.default, AuthController_1.getAllUsers);
exports.default = router;
