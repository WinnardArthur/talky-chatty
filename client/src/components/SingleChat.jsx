import React from 'react'
import { ChatState } from '../Context/ChatProvider'

const SingleChat = ({fetchAgain, setFetchAgain}) => {
    const { user, selectedChat, setSelectedChat } = ChatState();

  return (
    <div>
        {selectedChat ? 
        (
            <div>
                {/* header */}
                <div className='flex items-center'>
                    <p onClick={() => setSelectedChat("")}>icon</p>
                    <h1></h1>
                </div>
            </div>
        ) : (
            <div className='flex h-full items-center justify-center'>
                <p className='text-4xl font-sans'>
                    Click on a user to start chatting
                </p>
            </div>
        )}
    </div>
  )
}

export default SingleChat