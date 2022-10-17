import React, { useContext } from 'react';
import ChatBox from '../components/ChatBox';
import SideDrawer from '../components/Miscellaneous/SideDrawer';
import MyChats from '../components/MyChats';
import { ChatState } from '../Context/ChatProvider';
 
function ChatPage() {
  const { user } = ChatState();
  
  return (
    <div>
      {user && <SideDrawer />}

      <div>
        {user && <MyChats />}
        {user && <ChatBox />}
      </div>
    </div>
  )
}

export default ChatPage