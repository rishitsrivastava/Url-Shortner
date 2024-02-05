import React, { useState } from 'react'
import Heading from '../components/Heading'
import SubHeading from '../components/SubHeading'
import InputBox from '../components/InputBox'
import Button from '../components/Button'
import BottomWarning from '../components/BottomWarning'
import { useNavigate } from 'react-router-dom'
import axios from 'axios';

export default function Signup() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = async () => {
    try {
      const url = "http://localhost:3000/api/v1/user/signup";

      const userData = {
        userName,
        password,
        firstName,
        lastName
      };
      const response = await axios.post(url, userData, {
        withCredentials: true
      })

      localStorage.setItem("token", response.data.token);
      navigate("/dashboard");
    } catch (error) {
      console.error("Signup error:", error);
    }
  };

  return (
    <div className='bg-slate-950 flex justify-center text-white h-screen'>
      <div className='flex flex-col shadow-2xl justify-center'>
        <div className='rounded-lg bg-slate-900 text-white text-center p-2 h-max px-4'>
          <Heading label={"Sign up"} />
          <SubHeading label={"Enter your information to create an account"} />
          <InputBox onChange={(e) => {setFirstName(e.target.value)}} placeholder="John" label={"First Name"} />
          <InputBox onChange={(e) => {setLastName(e.target.value)}} placeholder="Doe" label={"Last Name"} />
          <InputBox onChange={(e) => {setUserName(e.target.value)}} placeholder="user@gmail.com" label={"email"} />
          <InputBox onChange={(e) => {setPassword(e.target.value)}} placeholder="123456" label={"Password"} />
        <div className='pt-4'>
          <Button 
            onClick={handleSignup}
            label={"Sign up"} />
        </div>
        <BottomWarning label={"Already have an account"} buttonText={"Sign in"} to={"/signin"} />
       </div>
      </div>
    </div>
  )
}
