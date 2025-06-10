import {createContext, useContext, useEffect, useState, type ReactNode} from 'react'
import {useNavigate}  from 'react-router-dom'
interface Ichat {
  user: string | null;
  setUser: React.Dispatch<React.SetStateAction<string | null>>;

  selectedChat: any; // Replace 'any' with your Chat type if available
  setSelectedChat: React.Dispatch<React.SetStateAction<any>>;

  notification: any[]; // Replace 'any' with your Notification type if available
  setNotification: React.Dispatch<React.SetStateAction<any[]>>;

  chats: any; // Preferably: chats: Chat[] or whatever type your chat list is
  setChats: React.Dispatch<React.SetStateAction<any>>; // or <Chat[]>
}

const ChatContext  = createContext<Ichat|undefined>(undefined);
const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();

  const [selectedChat, setSelectedChat] = useState<any>(null);
  const [user, setUser] = useState<string | null>(null);
  const [notification, setNotification] = useState<any[]>([]);
  const [chats, setChats] = useState<any>([]);

  useEffect(() => {
    const storetoken: string | null = localStorage.getItem("token");
    setUser(storetoken);

    if (storetoken) navigate("/Home");
    else navigate("/login");
  }, [navigate]);

  return (
    <ChatContext.Provider
      value={{
        user,
        setUser,
        selectedChat,
        setSelectedChat,
        notification,
        setNotification,
        chats,
        setChats,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const ChatState = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("ChatState must be used within a ChatProvider");
  }
  return context;
};
export default ChatProvider 