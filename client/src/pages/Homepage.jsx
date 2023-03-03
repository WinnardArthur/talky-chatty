import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { rootUrl } from '../global'

const API = axios.create({baseURL: rootUrl})

const colors = ['#EF4444', '#10B981', '#3B82F6', '#6366F1', '#8B5CF6', '#F97316', '#10B981', '#14B8A6', '#3B82F6', '#F43F5E'];

const userInfo = {
  fullName: '',
  email: '',
  password: '',
  confirmPassword: '',
  pic: ''
}


function Homepage() {
  const [user, setUser] = useState(userInfo);
  const [loginType, setLoginType] = useState('login');  
  const [signUpType, setSignUpType] = useState('signup');  
  const [active, setActive] = useState(loginType);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [picLoading, setPicLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));

    if(userInfo) navigate("/chats")

  }, [navigate])

  const handleAuth = (type) => {
    setActive(type)
  }

  const handleChange = (e) => {
    setUser({...user, [e.target.name]: e.target.value})
  }

  const uploadProfile = (pic) => {
    console.log(pic)
    setPicLoading(true);

    if(pic === undefined) {
      toast.error("", {
        position: toast.POSITION.TOP_RIGHT
      })
      setPicLoading(false);
      return;
    }
    
    if(pic.type === "image/jpeg" || pic.type === "image/png") {
      const mb = 1048000;
      const picSize = Math.floor(pic.size / mb).toFixed(0)
  
      if(picSize >= 5) {
        return toast.error('Picture should be less than 5 MB, Picture Size is', {
          theme: "light"
        })
      }

      const data = new FormData();
      data.append("file", pic);
      data.append("upload_preset", "talky-chatty");
      data.append("cloud_name", "dw7xy98ip");
      data.append("folder", "talky-chatty")
      fetch("https://api.cloudinary.com/v1_1/dw7xy98ip/image/upload", {
        method: "post",
        body: data
      }).then((res) => res.json())
        .then((data) => {
          console.log('data', data)
          setUser({...user, pic: data.url.toString()});
          setPicLoading(false)
        })
        .catch((err) => {
          console.log(err)
          setPicLoading(false);
        })

    } else {
      toast.warn("Please select an image", {
        position: "top-right",
        theme: "light"
      })
      setPicLoading(false)
    }

  }

  const randomColor = () => {
    let randomValue = Math.floor(Math.random() * colors.length);

    return colors[randomValue]
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    if(active === signUpType) {
      // Sign up 

      if(!user.fullName || !user.email || !user.password || !user.confirmPassword) {
        setLoading(false)
        return toast.error("Please fill all the fields", {})
      }
  
      if(user.password !== user.confirmPassword) {
        setLoading(false)
        return toast.error("Passwords do not Match", {})
      }

      try {
        console.log(user)
        const { data } = await API.post(`/api/users`, user)

        if(data.responseUser.pic.length < 1) {
          localStorage.setItem("profileColor", JSON.stringify(randomColor()))
        }
        localStorage.setItem("userInfo", JSON.stringify(data))
        toast.success("Registration Successfull")
        setLoading(false);
        navigate("/chats")
      } catch (error) {
        if(error) {
          const errorMessage = error.response.data.message;
          toast.error(errorMessage)
        }
        setLoading(false);
      }
    } else {
      
      // Login

      if(!user.email || !user.password) {
        setLoading(false)
        return toast.warn("Please fill all fields")
      }

      let loginUser = {
        email: user.email,
        password: user.password
      }

      try {
        const { data } = await API.post(`/api/users/login`, loginUser);
        if(data.responseUser.pic.length < 1) {
          localStorage.setItem("profileColor", JSON.stringify(randomColor()))
        }
        localStorage.setItem("userInfo", JSON.stringify(data))
        toast.success("Sign In  Successfull")
        setLoading(false)
        navigate('/chats')
      } catch (error) {
        if(error) {
          const errorMessage = error.response.data.message;
          toast.error(errorMessage);
        }
        setLoading(false);
      }
    }
  }

  return (
    <div className="w-full h-full">
      <div className='bg-background h-full w-full py-12 lg:py-0 lg:h-screen bg-repeat bg-[length:110px_110px]'>
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
                      <input type='email' value={user.email} name='email' placeholder='Enter your name' onChange={(e) => handleChange(e)} className='input'/>
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
                      <input type='file' accept='image/*' name='pic' onChange={(e) => uploadProfile(e.target.files[0])} className='input'/>
                      {picLoading && <p className='text-center font-bold italic mt-2'>Loading...</p>}
                    </div>
                  </>
                }
                <div>
                  <button onClick={handleSubmit} className={`text-center w-full bg-orange-500 font-bold text-xl py-2 rounded-sm text-white disabled:bg-orange-300`} disabled={loading}>
                    {active === loginType && <p>{loading ? 'Processing' : 'Login'}</p>}
                    {
                      active === signUpType && <p>{loading ? 'Processing' : 'Register'}</p>
                    }
                  </button>
                  {
                    active === loginType &&
                    <button className='text-center w-full bg-red-500 mt-4 font-semibold text-lg py-2 rounded-sm text-white'>Guest User Credentials</button>
                  }
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