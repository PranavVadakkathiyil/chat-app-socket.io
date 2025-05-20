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
exports.loginUser = exports.registerUser = void 0;
const UserModel_1 = __importDefault(require("../models/UserModel"));
const AccessandRefreshToken = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield UserModel_1.default.findById(userId);
        const accesstoken = user.accessToken();
        const refreshtoken = user.refershToken();
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
    const { name, email, password, pic } = req.body;
    try {
        if (!name || !email || !password || !pic) {
            res.status(400).json({ message: "All fileds required" });
            return;
        }
        const exisitUser = yield UserModel_1.default.findOne({ email });
        if (exisitUser)
            res.status(200).json({ message: "User Exist" });
        const user = yield UserModel_1.default.create({
            name,
            email,
            password,
            pic,
        });
        if (user) {
            //const {accesstoken,refreshtoken} = await AccessandRefreshToken(user._id)
            res
                .status(201)
                .json({
                message: "User Registerd Successfully",
                _id: user._id,
                name: user.name,
                email: user.email,
                pic: user.pic,
            });
        }
    }
    catch (error) { }
});
exports.registerUser = registerUser;
const loginUser = () => { };
exports.loginUser = loginUser;
