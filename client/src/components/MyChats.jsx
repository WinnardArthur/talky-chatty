import React, { useEffect, useState } from 'react';
import { ChatState } from '../Context/ChatProvider';
import { toast } from 'react-toastify';
import axios from 'axios';
import { getSender } from '../config/ChatLogic';
import { AiOutlinePlus } from 'react-icons/ai';


const API = axios.create({baseURL: 'http://localhost:5000'})

const MyChats = () => {
  const [loggedUser, setLoggedUser] = useState();
  const { user, chats, setChats, selectedChat, setSelectedChat } = ChatState()

  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      }

      const { data } = await API.get("/api/chat", config);
      setChats(data)
    } catch (error) {
      if(error && error.response.data) {
        toast.error(error.response.data.message)
      }
    }
  }

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats()
  }, [])

  return (
    <div className='m-4'>

      <div className='bg-gray-50 w-[30%] rounded h-screen p-4'>

        <div className='flex justify-between items-center mb-6'>
          <h1 className='text-3xl'>My Chats</h1>
          <button className='flex items-center bg-gray-200 rounded py-2 px-4 hover:bg-gray-300'>
            <p className='text-sm mr-2'>New Group Chat</p>
            <AiOutlinePlus />
          </button>
        </div>

        <div>
          {chats.length > 0 ? (
            <div>
              {chats.map((chat) => (
                <div
                  onClick={() => setSelectedChat(chat)} 
                  key={chat._id}
                  className='mb-4'
                >
                  <div className={`rounded bg-gray-200 p-4 font-semibold cursor-pointer hover:bg-orange-400 hover:text-white ${selectedChat === chat && 'bg-orange-600 text-white'}`}>
                    {!chat.isGroupChat ? 
                      getSender(loggedUser, chat.users) : 
                      chat.chatName
                    }
                  </div>
                </div>
              ))}
            </div>
          ) : (
          <p>Loading...</p>
        )}
        </div>
      </div>
    </div>
  )
}

export default MyChats