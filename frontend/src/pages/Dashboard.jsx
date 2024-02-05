import React, { useState } from 'react'

export default function Dashboard() {
    const [url, setUrl] = useState("");

    const handlerf = () => {

    }

  return (
    <div className='bg-slate-950 h-screen'>
        <div className='bg-slate-800 p-7 mb-12'>
            <div className='text-slate-200 font-semibold text-2xl cursor-pointer'>
                URL Shortner
            </div>
        </div>

        <div className='bg-slate-800 m-12 p-5 flex flex-col items-center shadow-2xl justify-center'>
            <p className='text-slate-200 mr-7 font-semibold text-lg'>Enter the URL to be shortened :</p>
            <div className='flex items-center mt-3'>
                <input type="text" className='rounded-md bg-slate-200 w-96 size-8 pl-2 ' placeholder='Enter the URL' />
                <button className='ml-5 hover:text-slate-200 hover:bg-slate-950 bg-slate-200 text-slate-950 rounded-md hover:scale-125 font-semibold p-1 transition'>Shorten</button>
            </div>
        </div>
    </div>
  )
}
