"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const app_1 = __importDefault(require("./app"));
const db_1 = __importDefault(require("./utils/db"));
dotenv_1.default.config();
const PORT = Number(process.env.PORT);
//app.get('/',(req:Request,res:Response)=>{
//    res.send(new Date())
//})
(0, db_1.default)()
    .then(() => {
    app_1.default.listen(PORT, () => {
        console.log(`Server Runing          -:- http://localhost:${PORT}`);
    });
})
    .catch((err) => {
    console.log("Server Connection error ", err);
});
