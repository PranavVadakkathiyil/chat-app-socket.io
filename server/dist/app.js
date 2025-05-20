"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json({ limit: "16kb" }));
app.use(express_1.default.urlencoded({ extended: true, limit: '16kb' }));
const data_1 = __importDefault(require("./data/data"));
const AuthRoute_1 = __importDefault(require("./routes/AuthRoute"));
app.get('/api/v1/user', AuthRoute_1.default);
app.get('/api/chats', (req, res) => {
    res.send(data_1.default);
});
app.get('/api/chats/:id', (req, res) => {
    res.send(data_1.default.find((d) => d._id === req.params.id));
});
exports.default = app;
