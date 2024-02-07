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
            setAuthenticated(false);
            setLoading(false);
            return;
        }

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

    // const fetchTitle = async (longUrl) => {
    //   try {
    //       const response = await axios.get(longUrl);
    //       const html = response.data;
    //       const $ = cheerio.load(html);
    //       const title = $('title').text();
    //       return title;
    //   } catch (error) {
    //       console.error('Error fetching URL title:', error);
    //       return null;
    //   }
    // };

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
            // const longUrlTitle = await fetchTitle(url);
            setDisplayedValue([...displayedValue, { longurl: url, shorturl: response.data.shorturl}]);
          }
      } catch (error) {
          console.log(error)
          console.error('Error shortening URL:', error);
      }
    };

    const openInNewTab = (url) => {
      window.open(url, '_blank');
    };


  return (
    <div className='bg-slate-950 h-screen flex flex-col justify-center'>
      <div className='bg-slate-800 p-7 mb-12'>
          <div className='text-slate-200 font-semibold text-2xl cursor-pointer'>
              URL Shortner
          </div>
      </div>

      <div className='bg-slate-800 m-12 p-5 flex flex-col items-center shadow-2xl justify-center'>
          <p className='text-slate-200 mr-7 font-semibold text-lg'>Enter the URL to be shortened :</p>
          <div className='flex items-center mt-3 shadow-2xl'>
              <input type="text" onChange={handleInputChange} className='rounded-md bg-slate-200 w-96 size-8 pl-2 ' placeholder='Enter the URL' />
              <button onClick={handleShortenURL} className='ml-5 bg-slate-200 text-slate-950 rounded-md hover:scale-110 font-semibold p-1 transition'>Shorten URL</button>
          </div>
      </div>        

      <div className='bg-slate-800 h-80 lg:w-[80rem] shadow-2xl m-5 overflow-auto'>
        <div className='text-slate-200 grid-cols-2 font-medium text-lg flex flex-col m-5'>
            {displayedValue.map((urlData, index) => (
                <div key={index} className="flex flex-col mb-4">
                    <p className="font-semibold">Long URL: <a href="#" onClick={() => openInNewTab(urlData.longurl)}>{urlData.longurl}</a></p>
                    <p className="font-semibold">Short URL: <a href="#" onClick={() => openInNewTab(urlData.shorturl)}>{urlData.shorturl}</a></p>
                </div>
            ))}
        </div>
      </div>

    </div> 
  )
}
