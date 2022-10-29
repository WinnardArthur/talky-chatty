import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ChatContext = createContext();

// In case a user doesn't provide a profile image
// Get a random color for user background

const ChatProvider = ({ children }) => {
    const [user, setUser] = useState();
    const [selectedChat, setSelectedChat] = useState(null);
    const [notification, setNotification] = useState([]);
    const [chats, setChats] = useState([])
    const navigate = useNavigate();


    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        setUser(userInfo)

        if(!userInfo) {
            navigate('/')
        }

    }, [navigate])

    return (
    <ChatContext.Provider value={{ user, setUser, selectedChat, setSelectedChat, chats, setChats, notification, setNotification }}>
        {children}
    </ChatContext.Provider>
    )
}

export const ChatState = () => {
    return useContext(ChatContext);
}


export default ChatProvider;