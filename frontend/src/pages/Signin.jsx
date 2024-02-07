import React, { useState } from 'react'
import Heading from '../components/Heading'
import SubHeading from '../components/SubHeading'
import InputBox from '../components/InputBox'
import Button from '../components/Button'
import ButtonWarning from '../components/BottomWarning'
import { Navigate } from 'react-router-dom'
import axios from 'axios'

export default function Signin() {
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [loggedIn, setLoggedIn] = useState(false);

    const handleSignin = async () => {
        try {
          const url = "http://localhost:3000/api/v1/user/signin";
    
          const userData = {
            userName,
            password,
          };
          const response = await axios.post(url, userData, {
            withCredentials: true
          })
    
          localStorage.setItem("token", response.data.token);
          localStorage.setItem("isLoggedIn", true);
          setLoggedIn(true);
        } catch (error) {
          console.error("Signin error:", error);
        }
      };

      if (loggedIn && localStorage.getItem("isLoggedIn")) {
        return <Navigate to="/dashboard" />;
      }

  return (
    <div className='flex  bg-slate-950 h-screen justify-center'>
      <div className='flex shadow-2xl flex-col justify-center'>
        <div className='rounded-lg text-white p-2 text-center h-max px-4 bg-slate-900'>
          <Heading label={"Sign in"} />
          <SubHeading label={"Enter your credentials to access your account"} />
          <InputBox onChange={(e) => setUserName(e.target.value)} placeholder="user@gmail.com" label={"Email"} />
          <InputBox onChange={(e) => setPassword(e.target.value)}  placeholder="123456" label={"Password"} />
          <div className='pt-4'>
            <Button onClick={handleSignin} label={"Sign in"} />
          </div>
          <ButtonWarning label="Don't have an account" buttonText={"Sign up"} to={"/signup"} />
        </div>
      </div>
    </div>
  )
}
