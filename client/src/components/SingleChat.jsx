import React, { useState } from 'react'
import { getSender, getSenderFull } from '../config/ChatLogic';
import { ChatState } from '../Context/ChatProvider'
import ProfileModal from './Miscellaneous/ProfileModal';
import { BsArrowLeft } from 'react-icons/bs';
import { MdVisibility } from 'react-icons/md';
import UpdateGroupChatModal from './Miscellaneous/UpdateGroupChatModal';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useEffect } from 'react';
import ScrollableChat from './ScrollableChat';
import { io } from 'socket.io-client';
import { useRef } from 'react';
import { rootUrl } from '../global';

const API = axios.create({baseURL: rootUrl});

var selectedChatCompare, socket;


const SingleChat = ({fetchAgain, setFetchAgain}) => {
    const { user, selectedChat, setSelectedChat, notification, setNotification } = ChatState();
    const [showProfile, setShowProfile] = useState(false);
    const [showUpdateGroupModal, setShowUpdateGroupModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [newMessage, setNewMessage] = useState("");
    const [messages, setMessages] = useState([])
    const [socketConnected, setSocketConnected] = useState(false);
    const [typing, setTyping] = useState(false)
    const [isTyping, setIsTyping] = useState(false);
    const profileColor = JSON.parse(localStorage.getItem('profileColor')) || 'indigo';
    
    const latestMessageRef = useRef();

    const userLogo = (arrName) => {
        return arrName.split(" ").map(singleName => String(singleName).charAt(0))
    }


    useEffect(() => {
        socket = io(rootUrl);
        socket.emit("setup", user);
        socket.on('connected', () => {
            setSocketConnected(true)
        })
        socket.on("typing", () => setIsTyping(true));
        socket.on("stop typing", () => setIsTyping(false))  
     }, [])

    const fetchMessages = async () => {
        if(!selectedChat) return;

        try {
            setLoading(true);
              
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            }

            const { data } = await API.get(`/api/message/${selectedChat._id}`, config)

            setMessages(data);
            setLoading(false);

            socket.emit('join chat', selectedChat._id);

        } catch (error) {
            if(error) {
                return toast.error(error.response.data.message)
            }
        }
    }

    useEffect(() => {
        fetchMessages()

        selectedChatCompare = selectedChat;
    }, [selectedChat])

    useEffect(() => {
        socket.on('message received', (newMessageReceived) => {
            if(!selectedChatCompare || selectedChatCompare._id !== newMessageReceived.chat._id) {
                if(!notification.includes(newMessageReceived)) {
                    setNotification([newMessageReceived, ...notification])
                    setFetchAgain(!fetchAgain)
                }
                console.log('notification', newMessageReceived)
            } else {
                setMessages([...messages, newMessageReceived])
            }
        })
    })

    const sendMessage = async (e) => {
        if(e.key === "Enter" && newMessage) {
            e.preventDefault()
            socket.emit('stop typing', selectedChat._id)
            try {
                const config = {
                    headers: {
                        Authorization: `Bearer ${user.token}`
                    }
                }
                
                const {data} = await API.post('/api/message', {
                    content: newMessage,
                    chatId: selectedChat._id 
                }, config)
                
                socket.emit('new message', data, selectedChat._id)
                setNewMessage("")   
                setMessages([...messages, data])
            } catch (error) {
                if(error) {
                    return toast.error(error.response.data.message)
                }
            }
        }
    }

    const typingHandler = (e) => {
        setNewMessage(e.target.value);

        latestMessageRef.current.scrollIntoView({behaviour: 'smooth'})

        if(!socketConnected) return;

        if(!typing) {
            setTyping(true)
            socket.emit("typing", selectedChat._id);
        }

        let lastTypingTime = new Date().getTime();
        var timerLength = 3000;
          
        setTimeout(() => {
            var timeNow = new Date().getTime();
            var timeDifference = timeNow - lastTypingTime;

            if(timeDifference >= timerLength && typing) {
                socket.emit('stop typing', selectedChat._id)
                setTyping(false);
            }
        }, timerLength)
    }   

  return (
    <div className='w-full h-screen'>
        {selectedChat ? 
        (
            <div className='h-full'>
                {/* header */}
                <div className='flex items-center relative'>
                    <p onClick={() => setSelectedChat("")}>
                        <BsArrowLeft className='mr-2 hover:bg-gray-200 p-2 w-10 h-10 cursor-pointer md:hidden'/>
                    </p>
                    <h1 className='text-2xl font-semibold'>{!selectedChat.isGroupChat ? (
                        <div>
                            {getSender(user, selectedChat.users)}
                            <MdVisibility className='absolute top-[6px] right-1 w-6 h-6 text-gray-600 cursor-pointer' onClick={() => setShowProfile(!showProfile)}/>
                            <ProfileModal user={getSenderFull(user, selectedChat.users)} showProfile={showProfile} setShowProfile={setShowProfile} userLogo={userLogo} profileColor={profileColor}/>
                        </div>
                    ) : (
                        <div>
                            {selectedChat.chatName.toUpperCase()}
                            <MdVisibility className='absolute top-[6px] right-1 w-6 h-6 text-gray-600 cursor-pointer' onClick={() => setShowUpdateGroupModal(!showUpdateGroupModal)}/>
                        </div>
                    )}</h1>
                </div>
                
                {showUpdateGroupModal && <UpdateGroupChatModal fetchMessages={fetchMessages} showUpdateGroupModal={showUpdateGroupModal} setShowUpdateGroupModal={setShowUpdateGroupModal}/>}
                
                <div className='h-full w-full py-4'>
                    <div className='bg-gray-200 rounded-md h-full flex flex-col p-4'>
                        <div className='flex-1 overflow-y-scroll scrollbar-thin scrollbar-thumb-gray-300 pr-4 mb-4'>
                        {loading ? <p className='flex items-center justify-center text-2xl'>Loading...</p> : (
                            <div>
                                <ScrollableChat messages={messages}/>
                            </div>
                            )}
                        </div>
                        <form onKeyDown={sendMessage}>
                            <div ref={latestMessageRef}></div>
                            {isTyping ? <p>Typing</p> : <></>}
                            <input value={newMessage} type='text' onChange={typingHandler} placeholder='Enter a message...' className='w-full p-2 rounded-md focus:border-orange-200'/>
                        </form>
                    </div>        
                </div>
            </div>
        ) : (
            <div className='flex h-full items-center justify-center'>
                <p className='text-4xl font-sans text-gray-500 text-center'>
                    Click on a user to start chatting
                </p>
            </div>
        )}
    </div>
  )
}

export default SingleChat