import {connect} from "mongoose";
import dotenv from 'dotenv'
dotenv.config()
const MONGODB_URI = process.env.MONGODB_URI

const DBconnect = async()=>{
    try {
        const DBconnection =  await connect(MONGODB_URI!)
        console.log(`DB connected with host -:- ${DBconnection.connection.host}`);
        
    } catch (error) {
        console.log("DB connection failed ",error)
        
    }
}
export default DBconnect