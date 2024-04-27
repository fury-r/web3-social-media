import { faUser } from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import axios from '../../../api/axios'

const spyChecker = () => {
  const [data, setData] = useState([])

  useEffect(() => {
    getViews()
  }, [])

  const getViews = () => {
    axios
      .get('/v1/get-profile-viewers')
      .then((res) => {
        console.log(res.data)
        setData(res.data)
      })
      .catch((err) => {
        console.log(err.response.data)
      })
  }

  const clearViews = () => {
    axios
      .get('/v1/clear-profile-viewers')
      .then((res) => {
        console.log(res.data)
        getViews()
      })
      .catch((err) => {
        console.log(err.response.data)
      })
  }
  return (
    <div className='flex h-screen flex-1 flex-col p-2'>
      {data.length > 0 ? (
        data.map((value, key) => (
          <button
            key={key}
            onClick={() => {}}
            className='flex flex-row items-center justify-between p-3 shadow-md hover:opacity-50'
          >
            <div>
              <div className='rounded-full bg-gray-500 shadow-sm'>
                {value?.profile_pic ? (
                  <Image
                    src={`data:image/${value.type};base64,${value.image}`}
                    alt='myimage'
                    width={100}
                    height={100}
                    className='rounded-full'
                  />
                ) : (
                  <FontAwesomeIcon
                    color='black'
                    icon={faUser}
                    className='w-  text-9xl text-gray-500'
                  />
                )}{' '}
              </div>
              <label className='mt-2 text-3xl font-bold text-black'>
                {value.username}
              </label>
            </div>

            <label className='mt-2 text-xl  text-black'>{value.time}</label>
          </button>
        ))
      ) : (
        <div className='flex flex-1 flex-col items-center justify-center'>
          <label className='text-4xl font-bold'>No Views Found</label>
        </div>
      )}
      <button
        onClick={() => clearViews()}
        className='fixed bottom-40 right-20 rounded-full bg-cyan-500 p-4 text-3xl shadow-md'
      >
        {data.length} views
      </button>
    </div>
  )
}
export default spyChecker
