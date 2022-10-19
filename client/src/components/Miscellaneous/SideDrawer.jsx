import React, { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaBell, FaChevronDown } from 'react-icons/fa';
import { ChatState } from '../../Context/ChatProvider';
import ProfileModal from './ProfileModal';
import { toast } from 'react-toastify';
import axios from 'axios';
import UserListItem from '../UserAvatar/UserListItem';
import { useEffect } from 'react';
import decode from 'jwt-decode';

const colors = ['red', 'blue', 'gray', 'orange', 'indigo']

const API = axios.create({baseURL: 'http://localhost:5000'})

const SideDrawer = () => {
    const [search, setSearch] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingChat, setLoadingChat] = useState(false);
    const [showMore, setShowMore] = useState(false);
    const [showProfile, setShowProfile] = useState(false);
    const [showSidebar, setShowSidebar] = useState(false);
    const navigate = useNavigate();
    const { user, setSelectedChat, chats, setChats } = ChatState();
    const { user: { responseUser} } = ChatState();


    useEffect(() => {
        if(user) {
            const token = user?.token;
            const decodedToken = decode(token);
           if(decodedToken.exp * 1000 < new Date().getTime()) {
                return logoutHandler()
           }
        }

    }, [navigate])

    const logoutHandler = () => {
        localStorage.removeItem("userInfo");
        navigate("/")
    }
 
    const userLogo = (arrName) => {
        return arrName.split(" ").map(singleName => String(singleName).charAt(0))
    }

    const randomColor = useMemo(() => {
        let randomVal = Math.floor(Math.random() * colors.length);
        return colors[randomVal];
    }, [localStorage.getItem('userInfo')]) 

    const handleSearch = async () => {
        if(!search) {
            toast.warn("Search a name or email something in searh", { position: 'bottom-right'})
        }

        setLoading(true)
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            }

            const { data } = await API.get(`/api/users?search=${search}`, config)

            setLoading(false);
            setSearch("");
            setSearchResults(data);
        } catch (error) {
            if(error && error.response.data) {
                let { message } = error.response.data 

                toast.error(message)
            }
            setLoading(false);
        }
    }

    const accessChat = async (userId) => {
        setLoading(true)

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            }

            const { data } = await API.post('/api/chat', {userId}, config)
            
            if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats])

            setSelectedChat(data);
            setLoading(false);
            setShowSidebar(false);
            setSearchResults([])
        } catch (error) {
            if(error && error.response.data) {
                toast.error(error.response.data.message)
            }
            setLoading(false);
        }
    }


    return (
    <div>
        {/* Header */}
        <div className='bg-gray-50 px-4 flex justify-between items-center py-2'>
            <div onClick={() => setShowSidebar(!showSidebar)} className='flex items-center border p-2 bg-white cursor-pointer'>
                <FaSearch className='text-gray-500 text-sm mr-2'/>
                <input type='text' placeholder='Search User' className='border-none outline-none cursor-pointer'/>
            </div>
            <h1 className='text-2xl font-bold text-orange-500'>Talky-Chatty</h1>
            <div className='flex items-center justify-evenly w-[150px] relative'>
                <FaBell />
                <div className='flex items-center justify-evenly cursor-pointer' onClick={() => setShowMore(!showMore)}>
                    <div>
                        {responseUser.pic.length > 0 ? 
                            <img src={responseUser.pic} alt='user' className='w-8 h-8 rounded-full'/> :
                            <div className={`w-8 h-8 text-sm cursor-pointer flex justify-center items-center font-bold text-white rounded-full`} style={{background: randomColor}}>{userLogo(responseUser.name)}</div>
                        }
                    </div>
                    <FaChevronDown className='ml-2'/>
                </div>
                {showMore && 
                    <div className='absolute bg-gray-50 top-10 right-0 w-[180px]'>
                        <button className='text-center block w-full py-2 border-b-2 cursor-pointer hover:bg-gray-200' 
                            onClick={() => {
                                setShowProfile(!showProfile)
                                setShowMore(!showMore)
                            }}
                        >
                            Profile
                        </button> 
                        <button className='text-center py-2 w-full cursor-pointer hover:bg-gray-200' onClick={logoutHandler}>Logout</button>
                    </div>
                }
            </div>
            <ProfileModal user={responseUser} showProfile={showProfile} setShowProfile={setShowProfile} userLogo={userLogo}/>                    
        </div>

        {/* Drawer */}
        {showSidebar && 
        <div className='bg-gray-200 w-[300px] h-full fixed top-0 left-0 p-4'>
            <div>
                <div className='flex justify-between items-center'>
                    <h1 className='text-xl font-semibold text-gray-700'>Search Users</h1>
                    <p className='cursor-pointer' onClick={() => setShowSidebar(!showSidebar)}>Back</p>
                </div>
                <div className='mt-4'>
                    <input 
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className='outline-orange-500 py-2 px-2 rounded-md' placeholder="Search by name or email"/>
                    <button className='bg-orange-400 hover:bg-orange-500 hover:text-white p-2.5 px-4 text-sm cursor-pointer font-semibold' onClick={handleSearch}>Go</button>
                </div>
                {loading ? (
                    <div>Loading...</div>
                ) : (
                    searchResults.length > 0 && searchResults?.map((user) => (
                        <UserListItem 
                            key={user._id}
                            user={user}
                            handleFunction={() => accessChat(user._id)}    
                        />
                    ))
                )}
            </div>
        </div>
        }
    </div>
  )
}

export default SideDrawer