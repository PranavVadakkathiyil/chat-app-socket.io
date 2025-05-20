"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const AuthController_1 = require("../controllers/AuthController");
const router = (0, express_1.Router)();
router.route('/login').get(AuthController_1.loginUser);
router.route('/register').get(AuthController_1.registerUser);
exports.default = router;
