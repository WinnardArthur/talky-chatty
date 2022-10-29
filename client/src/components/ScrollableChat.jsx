import React from 'react'
import { isLastMessage, isSameSender, isSameSenderMargin, isSameUser, userLogo } from '../config/ChatLogic';
import { ChatState } from '../Context/ChatProvider';


const ScrollableChat = ({messages}) => {
    const { user } = ChatState();
    const profileColor = JSON.parse(localStorage.getItem('profileColor'))

  return (
    <div>
        {messages && messages.map((m,i) => (
            <div key={m._id} className='flex items-end'>
                {
                    (isSameSender(messages, m, i, user.responseUser._id) || 
                    isLastMessage(messages, i, user.responseUser._id)) && (
                        <div>
                            {m.sender.pic.length > 0 ?
                                <img src={m.sender.pic} alt="user" className='w-8 h-8 rounded-full'/>
                                :
                            <div className={`w-8 h-8 flex justify-center items-center font-semibold text-white rounded-full`} style={{"backgroundColor": `${profileColor?.length > 0 && profileColor || 'teal'}`}}>{userLogo(user)}</div>
                            }
                        </div>
                    )
                }
                <span style={{
                    marginLeft: isSameSenderMargin(messages, m, i, user.responseUser._id),
                    marginTop: isSameUser(messages, m, i, user._id) ? 3 : 10,
                   }} className={`${m.sender._id === user.responseUser._id ? 'bg-orange-200' : 'bg-blue-200'} rounded-lg px-2 py-2 max-w-[75%] text-sm`}>
                    {m.content}
                </span>
            </div>
        ))}
    </div>
  )
}

export default ScrollableChat