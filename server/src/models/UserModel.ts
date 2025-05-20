import mongoose, { Schema, model, models,Document, Types } from "mongoose";
import dotenv from 'dotenv'
dotenv.config()
const JWT_SECRET = process.env.JWT_SECRET 
const JWT_EXPIRE = process.env.JWT_EXPIRE 
import bcrypt from 'bcryptjs'
import jwt,{SignOptions} from 'jsonwebtoken'
export interface Iuser extends Document 
{   _id:Types.ObjectId,
    name:string,
    email:string,
    password:string,
    pic:string,
    isAdmin:boolean,
    refreshToken:string,
    
}
const userSchema = new Schema<Iuser>(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    pic: {
      type: "String",
      required: true,
      default:
        "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
    refreshToken: {
      type: String,
    },
  },
  { timestamps: true }
);

userSchema.pre<Iuser>("save",async function(next){
    if(!this.isModified("password")) return next()
    this.password = await bcrypt.hash(this.password,10)
})

userSchema.methods.isPasswordCorrect = async function (password:string) {
  return await bcrypt.compare(password, this.password);
};
userSchema.methods.accessToken =  function () {
    if(!JWT_SECRET){
        throw new Error("JWT_SECRET is not defined");
    }
    return jwt.sign({
        _id:this._id,
        name:this.name,

    },JWT_SECRET ,{ expiresIn:JWT_EXPIRE }as SignOptions)

}
userSchema.methods.refershToken =  function () {
    if (!JWT_SECRET) {
        throw new Error("JWT_SECRET is not defined");
    }
    return jwt.sign(
        { _id: this._id },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRE } as SignOptions
    );
}

const User =  models?.User || model<Iuser>("User", userSchema);

export default User