import { Request, Response } from "express";
import User from "../models/UserModel";

const AccessandRefreshToken = async(userId:string):Promise<{ accesstoken: string; refreshtoken: string }> => {
    try {
        const user = await User.findById(userId)
    const accesstoken = user.accessToken()
    const refreshtoken = user.refershToken()
    user.refreshToken = refreshtoken
    await user.save()
    return {accesstoken,refreshtoken}

    } catch (error) {
        console.log(error);
        throw error
        
        
    }
};
const registerUser = async (req: Request, res: Response): Promise<void> => {
  const { name, email, password, pic } = req.body;
  try {
    if (!name || !email || !password || !pic) {
      res.status(400).json({ message: "All fileds required" });
      return;
    }
    const exisitUser = await User.findOne({ email });
    if (exisitUser) res.status(200).json({ message: "User Exist" });
    const user = await User.create({
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
  } catch (error) {}
};
const loginUser = () => {};

export { registerUser, loginUser };
