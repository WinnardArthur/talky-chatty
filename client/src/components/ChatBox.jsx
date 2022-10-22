import React from 'react'
import { ChatState } from '../Context/ChatProvider'
import SingleChat from './SingleChat';

const ChatBox = ({ fetchAgain, setFetchAgain }) => {
  const { selectedChat } = ChatState();

  return (
    <div className={`rounded bg-gray-50 p-4`}>
        <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>
    </div>
  )
}

export default ChatBox