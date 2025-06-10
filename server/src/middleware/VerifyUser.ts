import { Response,NextFunction,Request } from "express"
import jwt,{JwtPayload} from "jsonwebtoken";
import dotenv from 'dotenv'
import User from "../models/UserModel";
dotenv.config()
interface AuhtRequest extends Request {
  verifyuser?: any; 
}
const verifyUser =async(req:AuhtRequest,res:Response,next:NextFunction)=>{

    try {
        const token = req.cookies?.accesstoken || req.header("Authorization")?.replace("Bearer ", "");


    if(!token){
        res.status(400).json({message:"User Unauthorized"})
    }
    const tokendecode = await jwt.verify(token,process.env.JWT_SECRET!)as JwtPayload
    const userdata = await User.findById(tokendecode?._id).select("-password");
    if(!userdata) res.status(400).json({message:"No user Exist"})
    req.verifyuser = userdata
    next()
    } catch (error) {
        console.log("Error on VerifyUser",error);
        
    }
    
}
export default verifyUser