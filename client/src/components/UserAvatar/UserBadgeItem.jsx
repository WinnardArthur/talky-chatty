import React from 'react';
import { AiOutlineClose } from 'react-icons/ai';


const UserBadgeItem = ({ user, handleFunction}) => {
  return (
    <div className='bg-orange-600 hover:bg-orange-500 shadow-md shadow-orange-900 text-white rounded flex items-center px-2 py-2'>
        <p className='font-bold text-sm'>{user.name}</p> 
        <AiOutlineClose onClick={handleFunction} className='ml-2 cursor-pointer'/>
    </div>
  )
}

export default UserBadgeItem