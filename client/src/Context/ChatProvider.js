import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ChatContext = createContext();

const colors = ['#EF4444', '#10B981', '#3B82F6', '#6366F1', '#8B5CF6', '#F97316', '#10B981', '#14B8A6', '#3B82F6', '#F43F5E']

// In case a user doesn't provide a profile image
// Get a random color for user background

const randomBackground = () => {
    let randomVal = Math.floor(Math.random() * colors.length);
    return colors[randomVal]
}

const ChatProvider = ({ children }) => {
    const [user, setUser] = useState();
    const [selectedChat, setSelectedChat] = useState(null);
    const [chats, setChats] = useState([])
    const navigate = useNavigate();

    // useMemo(() => {
    //     const userInfo = JSON.parse(localStorage.getItem("userInfo"));

    //     if(userInfo) {
    //         let userInfoWithBackground = {...userInfo, background: randomBackground()}

    //         return JSON.stringify("userInfo", userInfoWithBackground)
    //     }

    //     console.log('working', userInfo)
    // }, [user])

    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        setUser(userInfo)

        if(!userInfo) {
            navigate('/')
        }

    }, [navigate])

    return (
    <ChatContext.Provider value={{ user, setUser, selectedChat, setSelectedChat, chats, setChats }}>
        {children}
    </ChatContext.Provider>
    )
}

export const ChatState = () => {
    return useContext(ChatContext);
}


export default ChatProvider;