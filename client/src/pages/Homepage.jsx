import React, { useState } from 'react'
import { Link } from 'react-router-dom';

function Homepage() {
  const userInfo = {
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    profile: ''
  }

  const [user, setUser] = useState(userInfo);
  const [loginType, setLoginType] = useState('login');  
  const [signUpType, setSignUpType] = useState('signup');  
  const [active, setActive] = useState(loginType);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleAuth = (type) => {
    setActive(type)
  }

  const handleChange = (e) => {
    setUser({...user, [e.target.name]: e.target.value})
  }

  const uploadProfile = (pic) => {
    const mb = 1048000;
    const picSize = Math.floor(pic.size / mb).toFixed(0)
    console.log(pic)

    if(picSize >= 5) {
      return console.log('Picture should be less than 5 MB, Picture Size is', picSize)
    }
  }

  console.log('user', user)


  return (
    <div className="w-full h-full">
      <div className='bg-background bg h-full w-full py-12 lg:py-0 lg:h-screen bg-repeat bg-[length:110px_110px]'>
        <div className='h-full flex justify-evenly items-center'>
          
          <div>
            <h1 className='text-center  text-7xl pb-4 font-bold text-white '>Talky-Chatty</h1>
            <p className='text-white text-xl text-right mt-4 font-bold'>Signup/Login to start chatting</p>
            <p className='text-white text-lg text-right '>The best ideas begin as conversations</p>
          </div>

          <form className='w-1/3'>
            <div className='bg-white shadow-2xl rounded-md p-4 pb-5'>
              <div className='flex mb-4'>
                <Link onClick={() => handleAuth(loginType)} className={`text-center w-1/2 p-2 rounded-full cursor-pointer ${active === loginType && 'bg-orange-300 rounded-full cursor-pointer'}}`}>
                  <h2>Login</h2>
                </Link>
                <Link onClick={() => handleAuth(signUpType)} className={`text-center w-1/2 p-2 ${active === signUpType && 'bg-orange-300 rounded-full cursor-pointer'} `}>
                  <h2>Sign Up</h2>
                </Link>
              </div>
              <div>
                {active !== loginType &&
                <div className='mb-4'>
                  <h3 className='label'>Name <span className='inline-block pt-1 ml-1 text-red-500'>*</span></h3>
                  <input type='text' value={user.fullName} name='fullName' placeholder='Enter your name' onChange={(e) => handleChange(e)} className='input'/>
                </div>
                }
                  <>
                    <div className='mb-4'>
                      <h3 className='label'>Email <span className='inline-block pt-1 ml-1 text-red-500'>*</span></h3>
                      <input type='text'  value={user.email} name='email' placeholder='Enter your name' onChange={(e) => handleChange(e)} className='input'/>
                    </div>
                    <div className='mb-4'>
                      <h3 className='label'>Password <span className='inline-block pt-1 ml-1 text-red-500'>*</span></h3>
                      <div className='relative'>
                        <input type={showPassword ? 'text' : 'password'} value={user.password} name='password' placeholder='Enter your name' onChange={(e) => handleChange(e)} className='input'/>
                        <div  
                          onClick={(e) => setShowPassword(!showPassword)} className='absolute right-0 top-0 bg-slate-200 h-full cursor-pointer flex items-center px-3'>Show</div>
                      </div>
                    </div>
                  </>
                {
                  active !== loginType &&
                  <>
                    <div className='mb-4'>
                      <h3 className='label'>Confirm Password <span className='inline-block pt-1 ml-1 text-red-500'>*</span></h3>
                      <div className='relative'>
                        <input type={showConfirmPassword ? 'text' : 'password'} value={user.confirmPassword} name='confirmPassword' placeholder='Enter your name' onChange={(e) => handleChange(e)} className='input'/>
                        <div name='password' onClick={(e) => setShowConfirmPassword(!showConfirmPassword)} className='absolute right-0 top-0 bg-slate-200 h-full cursor-pointer flex items-center px-3'>Show</div>
                      </div>
                    </div>
                    <div className='mb-4'>
                      <h3 className='label'>Upload your Picture</h3>
                      <input type='file' accept='image/*' value={user.profile} name='profile' placeholder='Enter your name' onChange={(e) => uploadProfile(e.target.files[0])} className='input'/>
                    </div>
                  </>
                }
                <div>
                  <button className='text-center w-full bg-orange-500 font-bold text-xl py-2 rounded-sm text-white'>Sign Up</button>
                </div>
              </div>
            </div>
          </form>

        </div>
      
      </div>
    </div>
  )
}

export default Homepage