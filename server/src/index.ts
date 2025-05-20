import {Request,Response} from 'express'
import dotenv from 'dotenv'
import app from './app'
import DBconnect from './utils/db'

dotenv.config()
const PORT = Number(process.env.PORT!) 
//app.get('/',(req:Request,res:Response)=>{
//    res.send(new Date())
//})
DBconnect()
.then(()=>{
    app.listen(PORT,()=>{
    console.log(`Server Runing          -:- http://localhost:${PORT}`);
})  
})
.catch((err)=>{
    console.log("Server Connection error ",err)
})

