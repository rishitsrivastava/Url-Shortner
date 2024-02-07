import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom';
import { MdDelete } from "react-icons/md";

export default function Dashboard() {
    const [url, setUrl] = useState("");
    const [displayedValue, setDisplayedValue] = useState([]); 
    const [loading, setLoading] = useState(true);
    const [authenticated, setAuthenticated] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
          const token = localStorage.getItem('token');
          if (!token) {
              setAuthenticated(false);
              setLoading(false);
              return;
          }
            try {
                const response = await axios.get('http://localhost:3000/api/v1/user/urls', {
                    headers: {
                      Authorization: `Bearer ${token}`
                    }
                });
                if (response.status === 200) {
                    setAuthenticated(true);
                    setDisplayedValue(response.data)
                } else {
                    setAuthenticated(false);
                }
            } catch (error) {
                setAuthenticated(false);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (!authenticated && !loading) {
        return <Navigate to="/signin" />;
    }

    const handleInputChange = (e) => {
        setUrl(e.target.value);
        
    }

    const handleShortenURL = async () => {
      try {
          const token = localStorage.getItem('token');
          const response = await axios.post('http://localhost:3000/api/v1/url/shorten', {
              longurl: url
          },
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          if (response.status === 200) {
            const updatedUrls = [...displayedValue, { longurl: url, shorturl: response.data.shorturl, numberOfClicks:response.data.numberOfClicks }];
            setDisplayedValue(updatedUrls);
          }
      } catch (error) {
          console.log(error)
          console.error('Error shortening URL:', error);
      }
    };

    const openInNewTab = (url) => {
      window.open(url, '_blank');
    };

    const handleDelete = async (id) => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.delete(`http://localhost:3000/api/v1/user/urls/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (response.status === 200) {
          const updatedUrls = displayedValue.filter(url => url._id != id);
          setDisplayedValue(updatedUrls);
          console.log("URL deleted successfully");
        } else {
          console.error("Failed to delete URL:", response.data.message);
          alert("error while deleting.")
        }
      } catch (error) {
        console.error("Error while deleting URL:", error);
      }
    };
    


  return (
    <div className='bg-slate-950 h-screen flex flex-col justify-center overflow-auto'>
      <div className='bg-slate-800 p-7 mb-8'>
        <div className='text-slate-200 font-semibold text-2xl cursor-pointer'>
          URL Shortner
        </div>
      </div>

      <div className='bg-slate-800 mb-8 m-8 p-5 flex flex-col items-center shadow-2xl justify-center'>
          <p className='text-slate-200 mr-7 font-semibold text-lg'>Enter the URL to be shortened :</p>
          <div className='flex mt-4'>
            <div className='items-center flex shadow-2xl'>
              <input type="text" onChange={handleInputChange} className='rounded-md w-20 bg-slate-200 sm:w-96 size-8 pl-2 ' placeholder='Enter the URL' />
              <button onClick={handleShortenURL} className='ml-5 bg-slate-200 text-slate-950 rounded-md hover:scale-110 font-semibold p-1 transition'>Shorten URL</button>
            </div>
          </div>
      </div>

      <div className='flex justify-center'>
        <div className='bg-slate-800 h-80 lg:w-[80.5rem] shadow-2xl m-5 overflow-auto'>
          <table className='w-full'>
            <thead>
              <tr className='text-slate-200 text-left'>
                <th className='p-4'>Long URL</th>
                <th className='p-4'>Short URL</th>
                <th className='p-4'>Number of Clicks</th>
                <th className='p-4'>Delete</th>
              </tr>
            </thead>
            <tbody>
              {displayedValue.map((urlData, index) => (
                <tr key={index} className='text-slate-200 border-b border-slate-700'>
                  <td className='p-4 overflow-hidden'>
                    <a href='#' onClick={() => openInNewTab(urlData.longurl)}>{urlData.longurl}</a></td>
                  <td className='p-4 overflow-hidden'>
                    <a href="#" onClick={() => openInNewTab(urlData.shorturl)}>{urlData.shorturl}</a>
                  </td>
                  <td className='p-4'>{urlData.numberOfClicks}</td>
                  <td><button onClick={() => handleDelete(urlData._id)} className="ml-6 hover:scale-125"><MdDelete className='size-6' /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div> 
  )
}
