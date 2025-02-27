import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import ChatArea from "./ChatArea";
import "./MessagingPage.css";
  const fetchChats = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/users/connections", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });

        setUsers(response.data);
        const unreadData = {};
        const lastMessageData = {};

        response.data.forEach(user => {
          unreadData[user._id] = user.unreadMessages || 0;
          lastMessageData[user._id] = user.lastMessage || "";
        });

        setUnreadCounts(unreadData);
        setLastMessages(lastMessageData);
      } catch (error) {
        console.error("Error fetching connections:", error);
      }
    };
const MessagingPage = () => {
  const [activeChat, setActiveChat] = useState(null);
   const [isMobile, setIsMobile] = useState(false);
   const [isShow,setIsShow]=useState(false);
     useEffect(() => {
       const handleResize = () => {
         setIsMobile(window.innerWidth <= 768); // Adjust breakpoint as needed
       };
       handleResize();
       window.addEventListener('resize', handleResize);
       return () => {
         window.removeEventListener('resize', handleResize);
       };
     }, []);
  return (<>
    {isMobile && 
    <div className="messaging-container blue-theme enhanced-ui">
     {!isShow && <Sidebar activeChat={activeChat} setActiveChat={setActiveChat} fetchChats={fetchChats }isMobile={isMobile} setIsShow={setIsShow} />}
     {isShow && <ChatArea activeChat={activeChat} fetchChats={fetchChats} setActiveChat={setActiveChat} isMobile={isMobile} setIsShow={setIsShow} />}
    </div>}

    {!isMobile && 
    <div className="messaging-container blue-theme enhanced-ui">
      <Sidebar activeChat={activeChat} setActiveChat={setActiveChat} fetchChats={fetchChats }isMobile={isMobile} />
      <ChatArea activeChat={activeChat} fetchChats={fetchChats} setActiveChat={setActiveChat} isMobile={isMobile}/>
    </div>}
    </>
  );
};

export default MessagingPage;
