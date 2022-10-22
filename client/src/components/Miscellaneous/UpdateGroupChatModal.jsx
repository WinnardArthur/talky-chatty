import React, { useState } from 'react'
import { AiOutlineClose } from 'react-icons/ai'
import { ChatState } from '../../Context/ChatProvider';
import { toast } from 'react-toastify';
import UserBadgeItem from '../UserAvatar/UserBadgeItem';
import axios from 'axios';
import UserListItem from '../UserAvatar/UserListItem';


const API = axios.create({baseURL: 'http://localhost:5000'})

const UpdateGroupChatModal = ({ fetchAgain, setFetchAgain, showUpdateGroupModal, setShowUpdateGroupModal }) => {
    const [loading, setLoading] = useState(false);
    const [renameLoading, setRenameLoading] = useState(false);
    const [groupChatName, setGroupChatName] = useState("");
    const [search, setSearch] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const { selectedChat, user, setSelectedChat } = ChatState();


    const handleRemove = async (user1) => {
        if(selectedChat.groupAdmin._id !== user._id && user1._id !== user._id) {
            return toast.error("Only admins can remove someone", {position: "bottom-right"})
        }

        try {
            setLoading(true);

            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            }

            const { data } = await API.patch('/api/chat/groupremove', {
                chatId: selectedChat._id,
                userId: user1._id 
            }, config)

            user1._id === user._id ? setSelectedChat() : setSelectedChat(data);
            setFetchAgain(!fetchAgain)
            setLoading(false);
            toast.success("User removed", {position: "bottom-left"})
        } catch (error) {
            if(error && error.response) {
                toast.error(error.response.data.message) 
            }
            setLoading(false);
        }
    }


    const handleAddUser = async (user1) => {
        if(selectedChat.users.find((u) => u._id === user1._id)) {
           return toast.warn("User Already in group!", {position: 'bottom-right'})
        }

        if(selectedChat.groupAdmin._id !== user._id) {
            return toast.warn("Only admins can add someone!", {position: "bottom-right"})
        }

        try {
            setLoading(true);

            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            }

            const { data } = await API.patch('/api/chat/groupadd', {
                chatId: selectedChat._id,
                userId: user1._id 
            }, config)

            setSelectedChat(data);
            setFetchAgain(!fetchAgain)
            setLoading(false);
        } catch (error) {
            if(error && error.response) {
                toast.error(error.response.data.message) 
            }
            setLoading(false);
        }
    }

    const handleRename = async (e) => {
        e.preventDefault();
        if (!groupChatName) return;

        try {
            setRenameLoading(true);

            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            }

            const { data } = await API.patch('/api/chat/rename', {
                chatId: selectedChat._id,
                chatName: groupChatName
            }, config)

            setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            setRenameLoading(false);
        } catch (error) {
            if(error && error.response) {
                toast.error(error.response.data.message) 
            }
            setRenameLoading(false);
        }

        setGroupChatName("")
    }

    const handleSearch = async (query) => {
        if(!query) return;

        setSearch(query)

        try {
            setLoading(true);

            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            }

            const { data } = await API.get(`/api/users?search=${search}`, config)
            setLoading(false);
            setSearchResults(data);
        } catch (error) {
            if(error && error.response) {
                toast.error(error.response.data.message)
            }
            setLoading(false);
        }
    }
   

  return (
    <div className='fixed top-0 left-0 bg-black/60 w-full h-full z-50' onClick={() => setShowUpdateGroupModal(false)}>
        <div className='flex justify-center items-center h-full'>
            <div onClick={e => e.stopPropagation()} className='bg-white flex flex-col items-center justify-evenly relative w-[80%] sm:w-[50%]  lg:w-1/3  rounded-md opacity-1 py-3'>
                <AiOutlineClose className='cursor-pointer absolute right-3 top-3 text-2xl' onClick={() => setShowUpdateGroupModal(false)} />
                <h1 className='text-3xl font-semibold py-4'>{selectedChat.chatName}</h1>
                
                <div className='flex flex-wrap gap-4 mt-6 justify-start w-[80%]'>
                    {selectedChat.users?.map(u => (
                        <UserBadgeItem key={user._id} user={u} handleFunction={() => handleRemove(u)}/>
                    ))}
                </div>

                <form className='w-[80%] mt-8 flex justify-between '>
                    <input 
                        className='border outline-none p-2 px-4 w-full border-r-0 focus:border-orange-400 focus:border-2 rounded border-gray-400 placeholder:text-sm' 
                        type='text' 
                        placeholder="Chat Name" 
                        onChange={(e) => setGroupChatName(e.target.value)}
                    />
                    <button onClick={(e) => handleRename(e)} className='border-2 font-semibold border-orange-400 bg-orange-400 hover:bg-transparent rounded px-2 py-2 text-sm rounded-l-none'>
                        {renameLoading ? 'Loading...' : 'Update'} 
                    </button>
                </form>

                <form className='w-[80%] mt-4 flex justify-between '>
                    <input 
                        className='border mt-4 outline-none p-2 px-4 w-full focus:border-orange-400 focus:border-2 rounded border-gray-400 placeholder:text-sm' 
                        type='text' 
                        placeholder="Add User to group" 
                        onChange={(e) => handleSearch(e.target.value)}
                    />
                </form>

                

                

                <div className='w-[80%] my-4 overflow-y-scroll scrollbar scrollbar-track-orange-100 scrollbar-thumb-orange-300 scrollbar-thin max-h-[200px]'>
                    {loading ? <p className='text-center'>Loading...</p> : (
                       <div>
                        {searchResults?.slice(0, 4).map((user) => (
                            <UserListItem 
                                key={user._id}
                                user={user}
                                handleFunction={() => handleAddUser(user)}
                            />
                        ))}
                       </div>
                    )}
                </div>

                <div className='w-[80%] flex justify-end mb-2'>
                    <button onClick={() => handleRemove(user)} className='border-2 font-semibold border-red-500 bg-red-600 text-white hover:bg-red-500 rounded px-12 py-2'>
                        Leave Group
                    </button>
                </div>
            </div>
        </div>
    </div>
  )
}

export default UpdateGroupChatModal