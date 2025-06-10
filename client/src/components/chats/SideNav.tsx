import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { ChatState } from "../../context/chatProvider";
import ChatLoading from "../ChatLoading";
import ProfileModal from "../ProfileModal";
import UserListItem from "../userAvatar/UserListItem";
import { ArrowBigDown, Bell } from "lucide-react";

function SideDrawer() {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const {
    setSelectedChat,
    user,
    notification,
    setNotification,
    chats,
    setChats,
  } = ChatState();

  const navigate = useNavigate();

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    navigate("/");
  };

  const handleSearch = async () => {
    if (!search) return;

    try {
      setLoading(true);
      
      const { data } = await axios.get(`/api/user?search=${search}`, { withCredentials: true });
      setSearchResult(data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(`/api/chat`, { userId }, config);
      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
      setSelectedChat(data);
      setLoadingChat(false);
      setIsOpen(false);
    } catch (error) {
      setLoadingChat(false);
    }
  };

  return (
    <>
      <div className="flex justify-between items-center bg-white w-full p-2 border-b">
        <button
          className="flex items-center space-x-2 px-2 py-1 hover:bg-gray-100 rounded"
          onClick={() => setIsOpen(true)}
        >
          <i className="fas fa-search"></i>
          <span className="hidden md:inline">Search User</span>
        </button>
        <h1 className="text-2xl font-semibold font-sans">Talk-A-Tive</h1>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <NotificationBadge count={notification.length} effect={Effect.SCALE} />
            <Bell className="w-6 h-6 text-gray-700" />
            <div className="absolute right-0 mt-2 bg-white shadow rounded w-48 z-10">
              {notification.length === 0 ? (
                <p className="p-2">No New Messages</p>
              ) : (
                notification.map((notif) => (
                  <div
                    key={notif._id}
                    className="p-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      setSelectedChat(notif.chat);
                      setNotification(notification.filter((n) => n !== notif));
                    }}
                  >
                    {notif.chat.isGroupChat
                      ? `New Message in ${notif.chat.chatName}`
                      : `New Message`}
                  </div>
                ))
              )}
            </div>
          </div>
          <div className="relative group">
            <button className="flex items-center bg-white px-2 py-1 border rounded">
              <img
                src={user.pic}
                alt={user.name}
                className="w-6 h-6 rounded-full mr-2"
              />
              <ArrowBigDown className="w-4 h-4" />
            </button>
            <div className="absolute right-0 mt-2 bg-white shadow-md rounded w-40 hidden group-hover:block z-20">
              <ProfileModal user={user}>
                <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                  My Profile
                </div>
              </ProfileModal>
              <hr />
              <div
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={logoutHandler}
              >
                Logout
              </div>
            </div>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-start z-50">
          <div className="bg-white w-80 p-4 shadow-lg h-full">
            <div className="font-semibold border-b pb-2">Search Users</div>
            <div className="flex mt-2 space-x-2">
              <input
                className="flex-1 border px-2 py-1 rounded"
                placeholder="Search by name or email"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button
                className="bg-blue-500 text-white px-3 py-1 rounded"
                onClick={handleSearch}
              >
                Go
              </button>
            </div>
            <div className="mt-4 overflow-auto max-h-[70vh]">
              {loading ? (
                <ChatLoading />
              ) : (
                searchResult?.map((user) => (
                  <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={() => accessChat(user._id)}
                  />
                ))
              )}
              {loadingChat && <p className="text-center mt-2">Loading chat...</p>}
            </div>
          </div>
          <div className="flex-1" onClick={() => setIsOpen(false)}></div>
        </div>
      )}
    </>
  );
}

export default SideDrawer;
