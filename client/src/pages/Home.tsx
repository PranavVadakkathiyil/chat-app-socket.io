import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { ChatState } from '@/context/chatProvider';
import SideNav from '@/components/chats/SideNav';
import { Box } from "@chakra-ui/react"
import MyChats from '@/components/MyChats';
import Chatbox from '@/components/Chatbox';

type Chat = {
  _id: string;
  chatName: string;
  isGroupChat: boolean;
  users: { name: string; email: string }[];
  groupAdmin?: { name: string; email: string };
};
const Home :React.FC= () => {
  const {user} = ChatState()

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
    
  return (
     <div style={{ width: "100%" }}>
      {user && <SideNav />}
      <Box d="flex" justifyContent="space-between" w="100%" h="91.5vh" p="10px">
        {user && <MyChats  />}
        {user && (
          <Chatbox  />
        )}
      </Box>
    </div>
  )
}

export default Home