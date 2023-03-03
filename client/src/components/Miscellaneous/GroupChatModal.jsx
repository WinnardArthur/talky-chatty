import axios from 'axios';
import React from 'react'
import { useState } from 'react';
import { AiOutlineClose } from 'react-icons/ai';
import { toast } from 'react-toastify';
import { ChatState } from '../../Context/ChatProvider';
import UserBadgeItem from '../UserAvatar/UserBadgeItem';
import UserListItem from '../UserAvatar/UserListItem';
import { rootUrl } from '../../global'

const GroupChatModal = ({ showCreateGroupModal, setShowCreateGroupModal }) => {
    const [groupChatName, setGroupChatName] = useState();
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);

    const { user, chats, setChats } = ChatState();

    const API = axios.create({baseURL: rootUrl});

    const handleSearch = async (query) => {
        setSearch(query)
        if(!query) {
            return setSearchResults([]);
        }

        try {
            setLoading(true);
            
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            }

            const { data } = await API.get(`/api/users?search=${search}`, config);
            setLoading(false);
            setSearchResults(data);
        } catch (error) {
            if(error && error.response) {
                toast.error(error.response.data.message)
            }
        }
    }

    const handleSubmit = async () => {
        if(!groupChatName || !selectedUsers) {
            return toast.warn("Please fill all the fields")
        }
        try {
            const config = { 
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            }

            const { data } = await API.post('/api/chat/group', {
                name: groupChatName,
                users: JSON.stringify(selectedUsers.map((u) => u._id))
            }, config)

            setChats([data, ...chats])
            setShowCreateGroupModal(false);
            toast.success("New Group Chat Created")
        } catch (error) {
            if(error && error.response) {
                toast.error(error.response.data.message)
            }
        }
    }

    const handleGroup = (userToAdd) => {
        if(selectedUsers.includes(userToAdd)) {
            return toast.warn("User added already")
        }

        setSelectedUsers([...selectedUsers, userToAdd])
    }

    const handleDelete = (userToRemove) => {
        return setSelectedUsers(selectedUsers.filter((user) => user._id !== userToRemove._id))
    }
    
  return (
    <div>
         <>
        { 
            <div className='fixed top-0 left-0 bg-black/60 w-full h-full z-50' onClick={() => setShowCreateGroupModal(!showCreateGroupModal)}>
                <div className='flex justify-center items-center h-full'>
                    <div onClick={e => e.stopPropagation()} className='bg-white flex flex-col items-center justify-evenly relative w-[80%] h-[350px] sm:w-[50%] sm:h-[450px] lg:w-1/3 lg:h-[500px] 2xl:h-[500px] rounded-md opacity-1 pt-3'>
                        <AiOutlineClose className='cursor-pointer absolute right-3 top-3 text-2xl' onClick={() => setShowCreateGroupModal(!showCreateGroupModal)} />
                        <h1 className='text-3xl font-semibold'>Create Group Chat</h1>
                        
                        <div className='w-[80%] mt-4'>
                            <input 
                                className='border outline-none p-2 px-4 w-full focus:border-orange-400 focus:border-2 rounded border-gray-400 placeholder:text-sm' 
                                type='text' 
                                placeholder="Chat Name" 
                                onChange={(e) => setGroupChatName(e.target.value)}
                            />
                            <input 
                                className='border mt-4 outline-none p-2 px-4 w-full focus:border-orange-400 focus:border-2 rounded border-gray-400 placeholder:text-sm' 
                                type='text' 
                                placeholder="Add Users eg: John, Chris, Jane" 
                                onChange={(e) => handleSearch(e.target.value)}
                            />
                        </div>

                        <div className='flex flex-wrap gap-4 mt-6 justify-start w-[80%]'>
                            {selectedUsers?.map(u => (
                                <UserBadgeItem key={user._id} user={u} handleFunction={() => handleDelete(u)}/>
                            ))}
                        </div>

                        <div className='w-[80%] my-4 overflow-y-scroll scrollbar scrollbar-track-orange-100 scrollbar-thumb-orange-300 scrollbar-thin'>
                            {loading ? <p>Loading...</p> : (
                                searchResults?.slice(0, 9).map((user, index) => (
                                    <div key={index}>
                                        <UserListItem user={user} handleFunction={() => handleGroup(user)}/>
                                    </div>
                                ))
                            )}
                        </div>

                        <div className='w-[80%] flex justify-end mb-2'>
                            <button onClick={handleSubmit} className='border-2 font-semibold border-orange-400 bg-orange-400 hover:bg-transparent rounded px-12 py-2'>Create Chat</button>
                        </div>
                    </div>
                </div>
            </div>
        }
    </>
    </div>
  )
}

export default GroupChatModal