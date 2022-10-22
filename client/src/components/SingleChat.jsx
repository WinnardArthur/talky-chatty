import React, { useState } from 'react'
import { getSender, getSenderFull } from '../config/ChatLogic';
import { ChatState } from '../Context/ChatProvider'
import ProfileModal from './Miscellaneous/ProfileModal';
import { BsArrowLeft } from 'react-icons/bs';
import { MdVisibility } from 'react-icons/md';
import UpdateGroupChatModal from './Miscellaneous/UpdateGroupChatModal';

const SingleChat = ({fetchAgain, setFetchAgain}) => {
    const { user, selectedChat, setSelectedChat } = ChatState();
    const [showProfile, setShowProfile] = useState(false);
    const [showUpdateGroupModal, setShowUpdateGroupModal] = useState(false);

    const userLogo = (arrName) => {
        return arrName.split(" ").map(singleName => String(singleName).charAt(0))
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
                            <ProfileModal user={getSenderFull(user, selectedChat.users)} showProfile={showProfile} setShowProfile={setShowProfile} userLogo={userLogo}/>
                        </div>
                    ) : (
                        <div>
                            {selectedChat.chatName.toUpperCase()}
                            <MdVisibility className='absolute top-[6px] right-1 w-6 h-6 text-gray-600 cursor-pointer' onClick={() => setShowUpdateGroupModal(!showUpdateGroupModal)}/>
                        </div>
                    )}</h1>
                </div>

                {showUpdateGroupModal && <UpdateGroupChatModal showUpdateGroupModal={showUpdateGroupModal} setShowUpdateGroupModal={setShowUpdateGroupModal}/>}
                
                <div className='h-full w-full py-4'>
                    <div className='bg-gray-200 rounded-md h-full flex flex-col'>
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