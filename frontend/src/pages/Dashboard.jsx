import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom';

export default function Dashboard() {
    const [url, setUrl] = useState("");
    const [displayedValue, setDisplayedValue] = useState([]); 


    const [loading, setLoading] = useState(true);
    const [authenticated, setAuthenticated] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            setAuthenticated(false); // No token found, user not authenticated
            setLoading(false);
            return;
        }

        // Check if token is valid by sending a request to the backend
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/v1/user/urls', {
                    headers: {
                      Authorization: `Bearer ${token}`
                    }
                });
                if (response.status === 200) {
                    setAuthenticated(true); // User authenticated
                } else {
                    setAuthenticated(false); // Invalid token or other error
                }
            } catch (error) {
                setAuthenticated(false); // Error occurred, user not authenticated
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Redirect to signin page if not authenticated or loading
    if (!authenticated && !loading) {
        return <Navigate to="/signin" />;
    }


    const handleInputChange = (e) => {
        setUrl(e.target.value);
        
    }

    const handlerf = () => {
      console.log(url);
    };


  return (
    <div className='bg-slate-950 h-screenf flex flex-col justify-center'>
        <div className='bg-slate-800 p-7 mb-12'>
            <div className='text-slate-200 font-semibold text-2xl cursor-pointer'>
                URL Shortner
            </div>
        </div>

        <div className='bg-slate-800 m-12 p-5 flex flex-col items-center shadow-2xl justify-center'>
            <p className='text-slate-200 mr-7 font-semibold text-lg'>Enter the URL to be shortened :</p>
            <div className='flex items-center mt-3 shadow-2xl'>
                <input type="text" onChange={handleInputChange} className='rounded-md bg-slate-200 w-96 size-8 pl-2 ' placeholder='Enter the URL' />
                <button onClick={handlerf} className='ml-5 bg-slate-200 text-slate-950 rounded-md hover:scale-110 font-semibold p-1 transition'>Shorten URL</button>
            </div>
        </div>

        <div className='bg-slate-800 h-80 lg:w-[80rem] shadow-2xl m-5'>
            <div className='text-slate-200 grid-cols-3 font-medium text-lg flex justify-between m-5'>
            
            </div>
        </div>
    </div> 
  )
}
