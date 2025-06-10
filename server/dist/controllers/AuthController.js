"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllUsers = exports.loginUser = exports.registerUser = void 0;
const UserModel_1 = __importDefault(require("../models/UserModel"));
const cloudinary_1 = require("../utils/cloudinary");
const AccessandRefreshToken = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield UserModel_1.default.findById(userId);
        const accesstoken = yield user.accessToken();
        const refreshtoken = yield user.refershToken();
        user.refreshToken = refreshtoken;
        yield user.save();
        return { accesstoken, refreshtoken };
    }
    catch (error) {
        console.log(error);
        throw error;
    }
});
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const { name, email, password } = req.body;
    const avatarPath = (_b = (_a = req.files) === null || _a === void 0 ? void 0 : _a.avatar) === null || _b === void 0 ? void 0 : _b[0].path;
    try {
        if (!name || !email || !password) {
            res.status(400).json({ message: "All fileds required" });
            return;
        }
        const exisitUser = yield UserModel_1.default.findOne({ email });
        if (exisitUser) {
            res.status(200).json({ message: "User Already Exist", });
            return;
        }
        let picurl;
        if (avatarPath) {
            picurl = yield (0, cloudinary_1.uploadToCloudinary)(avatarPath);
        }
        const user = yield UserModel_1.default.create({
            name,
            email,
            password,
            pic: picurl === null || picurl === void 0 ? void 0 : picurl.secure_url,
        });
        if (user) {
            const { accesstoken, refreshtoken } = yield AccessandRefreshToken(user._id);
            const option = {
                httpOnly: true,
                secure: true
            };
            res
                .status(201)
                .cookie("accesstoken", accesstoken, option)
                .json({
                message: "User Registerd Successfully",
                success: true,
                _id: user._id,
                name: user.name,
                email: user.email,
                pic: user.pic,
                token: accesstoken
            });
        }
    }
    catch (error) {
        console.log("Register error", error);
    }
});
exports.registerUser = registerUser;
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const user = yield UserModel_1.default.findOne({ email });
        if (!user) {
            res.status(200).json({ message: "Please Signup" });
            return;
        }
        const checkPassword = yield user.isPasswordCorrect(password);
        if (!checkPassword) {
            res.status(200).json({ message: "Password Incorrect" });
            return;
        }
        const option = {
            httpOnly: true,
            secure: true
        };
        const { accesstoken, refreshtoken } = yield AccessandRefreshToken(user._id);
        res
            .status(201)
            .cookie("accesstoken", accesstoken, option)
            .json({
            success: true,
            message: "Login Successfully",
            _id: user._id,
            name: user.name,
            email: user.email,
            pic: user.pic,
            token: accesstoken
        });
    }
    catch (error) {
        console.log("Login error", error);
    }
});
exports.loginUser = loginUser;
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { search } = req.query;
    const SearchResult = search ?
        {
            $or: [{ name: { $regex: search, $options: "i" } }, { email: { $regex: search, $options: "i" } },]
        } : {};
    const users = yield UserModel_1.default.find(SearchResult).find({ _id: { $ne: req.verifyuser._id } });
    if (!users)
        res.status(400).json({ message: "No users" });
    res.status(200).json({ message: "get all users", users });
});
exports.getAllUsers = getAllUsers;
