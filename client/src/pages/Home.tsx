import React, { useEffect, useState } from 'react'
import axios from 'axios'
type Chat = {
  _id: string;
  chatName: string;
  isGroupChat: boolean;
  users: { name: string; email: string }[];
  groupAdmin?: { name: string; email: string };
};
const Home :React.FC= () => {
    const [data, setdata] = useState<Chat[]>([])

    const getdata = async()=>{
        try {
            const chat = await axios.get<Chat[]>('/api/chats')
        console.log(chat);
        
        setdata(chat.data)
        } catch (error) {
            console.log(error);
            
        }
    }
    useEffect(() => {
      getdata()
    
      
    }, [])
    
  return (
    <div>
        {data.map((chat)=>(
            <div key={chat._id}>
                <p>{chat.chatName}</p>
            </div>
        ))}
    </div>
  )
}

export default Home