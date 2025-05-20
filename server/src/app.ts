import express,{Application,Request,Response} from 'express'
import cors from 'cors'
const app:Application = express()
app.use(cors())
app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended:true,limit:'16kb'}))



import chats from './data/data'
import AuthRoute from './routes/AuthRoute'

app.get('/api/v1/user',AuthRoute)

app.get('/api/chats',(req:Request,res:Response)=>{
    res.send(chats)
})
app.get('/api/chats/:id',(req:Request,res:Response)=>{
    res.send(chats.find((d)=>d._id === req.params.id))
})


export default app