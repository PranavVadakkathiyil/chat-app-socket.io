import { Request, Response } from "express";
import User from "../models/UserModel";
import { uploadToCloudinary } from "../utils/cloudinary";
import { UploadApiResponse } from "cloudinary";
interface AuhtRequest extends Request {
  verifyuser?: any; 
}
const AccessandRefreshToken = async(userId:string):Promise<{ accesstoken: string; refreshtoken: string }> => {
    try {
        const user = await User.findById(userId)
        
    const accesstoken = await user.accessToken()
    const refreshtoken =await user.refershToken()
    user.refreshToken = refreshtoken
    await user.save()
    return {accesstoken,refreshtoken}

    } catch (error) {
        console.log(error);
        throw error
        
        
    }
};
const registerUser = async (req: Request, res: Response): Promise<void> => {
  const { name, email, password } = req.body;
  const avatarPath = (req.files as { [fieldname: string]: Express.Multer.File[] })?.avatar?.[0].path;
  
  try {
    if (!name || !email || !password) {
      res.status(400).json({ message: "All fileds required" });
      return;
    }
    const exisitUser = await User.findOne({ email });
    if (exisitUser){ res.status(200).json({ message: "User Already Exist" , }); return}
    let picurl: UploadApiResponse | null | undefined;
    if(avatarPath){
       picurl = await uploadToCloudinary(avatarPath)
       
    }
    const user = await User.create({
      name,
      email,
      password,
      pic:picurl?.secure_url,
    });
    if (user) {
        const {accesstoken,refreshtoken} = await AccessandRefreshToken(user._id)

      const option = {
        httpOnly:true,
        secure:true
      }
      res
        .status(201)
        .cookie("accesstoken",accesstoken,option)
        .json({
          message: "User Registerd Successfully",
          success:true,
          _id: user._id,
          name: user.name,
          email: user.email,
          pic: user.pic,
          token:accesstoken
          
        });
    }
  } catch (error) {
    console.log("Register error" ,error);
    
  }
};
const loginUser = async(req: Request, res: Response): Promise<void> => {
  const {email,password} = req.body
  
  try {
    const user = await User.findOne({email})
    if(!user) { 
         res.status(200).json({message:"Please Signup"})
         return
       
    }
    const checkPassword = await user.isPasswordCorrect(password)
    
    if(!checkPassword) { 
         res.status(200).json({message:"Password Incorrect"})
         return
       
    }
    const option = {
        httpOnly:true,
        secure:true
      }
        const {accesstoken,refreshtoken} = await AccessandRefreshToken(user._id)
        

      res
        .status(201)
        .cookie("accesstoken",accesstoken,option)
        .json({
          success:true,

          message: "Login Successfully",
          _id: user._id,
          name: user.name,
          email: user.email,
          pic: user.pic,
          token:accesstoken
          
        });

  } catch (error) {
        console.log("Login error" ,error);
        

  }

};

const getAllUsers = async(req:AuhtRequest,res:Response)=>{
  const {search} =req.query;
  const SearchResult = search ?
  {
    $or:[{name:{$regex:search,$options:"i"}},{email:{$regex:search,$options:"i"}},]
  }:{}
  const users = await User.find(SearchResult).find({_id:{$ne:req.verifyuser._id}})
  if(!users) res.status(400).json({message:"No users"})
  res.status(200).json({message:"get all users",users})
}

//const hi = async()=>{
//  const dser =await User.deleteMany({})
//  console.log(dser);
  
//}
//hi()

export { registerUser, loginUser,getAllUsers };
