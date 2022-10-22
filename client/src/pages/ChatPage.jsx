import React, { useContext } from 'react';
import { useState } from 'react';
import ChatBox from '../components/ChatBox';
import SideDrawer from '../components/Miscellaneous/SideDrawer';
import MyChats from '../components/MyChats';
import { ChatState } from '../Context/ChatProvider';
 
function ChatPage() {
  const { user } = ChatState();
  const [fetchAgain, setFetchAgain] = useState(false);
  const { selectedChat } = ChatState();
  
  return (
    <div>
      {user && <SideDrawer />}

      <div className='flex items-start justify-between px-7 md:px-2 lg:px-7 py-4'>
        <div className={`w-[100%] md:w-[28%] ${selectedChat ? 'hidden md:block' : ''}`}>
          {user && <MyChats fetchAgain={fetchAgain} />}
        </div>
        <div className={`h-screen w-full md:w-[70%] ${!selectedChat && 'hidden'} md:block ${selectedChat ? 'block' : ''}`}>
          {user && <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />}
        </div>
      </div>
    </div>
  )
}

export default ChatPage