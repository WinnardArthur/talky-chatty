import React from 'react'

const UserListItem = ({ user, handleFunction }) => {
  return (
    <div 
      onClick={handleFunction}
      className='flex items-center my-4 p-2 py-3 rounded-md bg-gray-300 hover:bg-orange-500 hover:text-white cursor-pointer'>
        <div>
          {user.pic ? 
          <img src={user.pic} alt="user" className='block w-12 h-12 rounded-full object-cover'/>
          :
          <div className='bg-teal-600 w-12 h-12 rounded-full flex items-center justify-center text-white text-2xl font-semibold'>{String(user.name).charAt(0).toUpperCase()}</div>
          }
        </div>
        <div className='ml-2'>
          <h3 className='text-md font-semibold'>{user.name}</h3>
          <p className='text-sm'><span className='font-bold'>Email:</span> {user.email}</p>
        </div>
    </div>
  )
}

export default UserListItem