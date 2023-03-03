import React from 'react'
import { AiOutlineClose } from 'react-icons/ai';
import { userLogo } from '../../config/ChatLogic';

const ProfileModal = ({ user, showProfile, setShowProfile, profileColor }) => {

  return (
    <>
        {showProfile && 
            <div className='fixed top-0 left-0 bg-black/60 w-full h-full' onClick={() => setShowProfile(!showProfile)}>
                <div className='flex justify-center items-center h-full'>
                    <div onClick={(e) => e.stopPropagation()} className='bg-white flex flex-col items-center justify-evenly relative w-[80%] h-[250px] sm:w-[50%] sm:h-[350px] md:w-1/3 lg:h-[400px] 2xl:h-[500px] rounded-md opacity-1'>
                        <AiOutlineClose className='cursor-pointer absolute right-5 top-5 text-2xl' onClick={() => setShowProfile(!showProfile)}/>
                        <h1 className='text-3xl font-semibold'>{user?.responseUser?.name}</h1>
                        {user?.responseUser ?
                        <>
                            <div>
                                {user?.responseUser?.pic ?
                                    <img src={user?.responseUser?.pic} alt="user"  className="w-28 h-28 rounded-full"/> :
                                    <div className='w-32 h-32 text-6xl flex justify-center items-center font-semibold text-white rounded-full' style={{"backgroundColor": `${profileColor?.length > 0 && profileColor}`}}>{userLogo(user)}</div>
                                }
                            </div>
                            <h1 className='text-xl sm:text-2xl font-normal text-gray-500 text-center'>Email: {user?.responseUser?.email}</h1>
                        </>
                        :
                        <>
                            <div>
                                {user?.pic ?
                                    <img src={user?.pic} alt="user"  className="w-28 h-28 rounded-full"/> :
                                    <div className='w-32 h-32 text-6xl flex justify-center items-center font-semibold text-white rounded-full' style={{"backgroundColor": `${profileColor?.length > 0 && profileColor}`}}>{userLogo(user)}</div>
                                }
                            </div>
                            <div>
                                <h1 className='text-xl sm:text-2xl font-normal text-gray-600 text-center'>Name: {user?.name}</h1>
                                <h1 className='text-xl sm:text-2xl font-normal text-gray-500 text-center'>Email: {user?.email}</h1>
                            </div>
                        </>
                        }
                    </div>
                </div>
            </div>
        }
    </>
  )
}

export default ProfileModal