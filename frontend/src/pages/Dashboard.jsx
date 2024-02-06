import React, { useState } from 'react'

export default function Dashboard() {
    const [url, setUrl] = useState("");
    const [displayedValue, setDisplayedValue] = useState([]); 

    const handleInputChange = (e) => {
        setUrl(e.target.value)
    }

    const handlerf = () => {
        setDisplayedValue([...displayedValue, { index: displayedValue.length + 1, value: url }]);
        setUrl('');
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
            <table className="border-collapse border border-slate-700 w-96">
          <thead>
            <tr>
              <th className="border border-slate-700 p-2">Index</th>
              <th className="border border-slate-700 p-2">Value</th>
            </tr>
          </thead>
          <tbody>
            {displayedValue.map((item) => (
              <tr key={item.index}>
                <td className="border border-slate-700 p-2">{item.index}</td>
                <td className="border border-slate-700 p-2">{item.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
            </div>
        </div>
    </div> 
  )
}
