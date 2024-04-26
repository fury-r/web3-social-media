import { faCircle, faUser } from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Router from 'next/router'
import React, { useEffect, useState } from 'react'
import axios from '../../../api/axios'
import Image from 'next/image'
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import toast, { Toaster } from 'react-hot-toast'

const Chat = () => {
  const [data, setData] = useState({
    data: [],
    mode: 0
  })
  const [search, setSearch] = useState([])
  useEffect(() => {
    handleGetConversations()
  }, [])

  const handleGetConversations = () => {
    axios
      .get('/v1/open-conversations')
      .then((res) => {
        console.log(res.data)
        setData(res.data)
      })
      .catch((e) => {
        console.log(e.response.data)
      })
  }
  const handleSearch = (e) => {
    const search = e.target.value
    if (e.target.value.length == 0) {
      setSearch([])
    }
    console.log(search)
    axios
      .post('/v1/search', {
        search
      })
      .then((res) => {
        if (res.data.length == 0) {
          toast.success('Nothing found')
        }
        setSearch(res.data)
      })
      .catch((e) => {
        console.log(e)
      })
  }

  const openConversation = (e) => {
    Router.push('/private/chat/conversation/' + e)
  }

  return (
    <div className='flex  flex-1 flex-col   bg-sky-100 h-screen'>
      <Toaster />
      <div className='mx-5 mt-1 flex flex-col'>
        <div className='m-2 flex  flex-col'>
          <div className='flex flex-row justify-center mt-4  '>
            <div className='flex flex-row items-center w-5/6 shadow-md rounded-3xl bg-white  border-grey px-3'>
              <input
                className=' w-full h-16 text-xl outline-none'
                type='text'
                name='search'
                onChange={handleSearch}
              />
              <FontAwesomeIcon
                className='text-2xl text-gray-400'
                icon={faSearch}
              />
            </div>
          </div>
          <ul>
            {search.length > 0 ? (
              search.map((value, key) => (
                <button
                  onClick={() => {
                    openConversation(search[key].username)
                  }}
                  key={key}
                  class=' flex flex-row items-center   justify-between  w-full rounded-md p-3 py-2 text-left shadow-md h-30 focus:outline-none focus-visible:bg-indigo-50  bg-white'
                >
                  <div
                    className={
                      'flex flex-row items-center justify-center rounded-full bg-slate-300 hover:shadow-md ' +
                      (value?.image ? '' : 'p-5')
                    }
                  >
                    {value?.img ? (
                      <Image
                        src={`data:image/${value.type};base64,${value.image}`}
                        alt='myimage'
                        width={60}
                        height={60}
                        className='rounded-full'
                      />
                    ) : (
                      <FontAwesomeIcon
                        color='black'
                        icon={faUser}
                        className='w-  text-xl text-gray-500'
                      />
                    )}
                  </div>
                  <div>
                    <h4 class='text-2xl font-semibold  text-gray-900 '>
                      {value.username}
                    </h4>
                    {data.mode == 1 ? (
                      <div class='text-[13px]'>
                        {value?.unseen > 0
                          ? value.unseen +
                            ' new ' +
                            (value.unseen > 1 ? 'messages' : 'message')
                          : value.msg}
                      </div>
                    ) : (
                      <></>
                    )}
                  </div>
                </button>
              ))
            ) : (
              <></>
            )}
          </ul>
        </div>
        {data.data.length && search.length == 0 > 0 ? (
          data.data.map((value, key) => (
            <button
              onClick={() => {
                openConversation(data.data[key].username)
              }}
              key={key}
              class=' flex flex-row  bg-white items-center  justify-between  w-full rounded-3xl my-2 p-3 py-2 text-left shadow-md h-30 focus:outline-none focus-visible:bg-indigo-50'
            >
              <div className='flex flex-row items-center justify-center'>
                <div
                  className={
                    ' rounded-full bg-slate-300 hover:shadow-md ' +
                    (value?.image ? '' : 'p-5')
                  }
                >
                  {value?.img ? (
                    <Image
                      src={`data:image/${value.type};base64,${value.image}`}
                      alt='myimage'
                      width={60}
                      height={60}
                      className='rounded-full'
                    />
                  ) : (
                    <FontAwesomeIcon
                      color='black'
                      icon={faUser}
                      className='w-  text-xl text-gray-500'
                    />
                  )}
                  <FontAwesomeIcon
                    className={
                      '  rounded-full  ' +
                      (value.active
                        ? 'bg-green-500 text-green-500'
                        : 'text-grey-500 bg-gray-500')
                    }
                    icon={faCircle}
                  />
                </div>
                <h4 class='text-2xl font-semibold  text-gray-900 m-2 '>
                  {value.username}
                </h4>
              </div>

              <div>
                <label className='text-xl text-gray-500 mb-2'>
                  {value.time}
                </label>

                {data.mode == 1 ? (
                  <div class='text-2xl mr'>
                    {value.unseen > 0
                      ? value.unseen +
                        ' new ' +
                        (value.unseen > 1 ? 'messages' : 'message')
                      : 'Last message: ' + value.msg}
                  </div>
                ) : (
                  <></>
                )}
              </div>
            </button>
          ))
        ) : search.length == 0 ? (
          <div className=' flex-col justify-center border-2 border-red-500 '>
            <label>No open conversations</label>
          </div>
        ) : (
          <></>
        )}
        {/* 

              <div class="divide-y divide-gray-200">

        <button class="w-full text-left py-2 focus:outline-none focus-visible:bg-indigo-50">
            <div class="flex items-center">
                <img class="rounded-full items-start flex-shrink-0 mr-3" src="https://res.cloudinary.com/dc6deairt/image/upload/v1638102932/user-32-02_vll8uv.jpg" width="32" height="32" alt="Nhu Cassel" />
                <div>
                    <h4 class="text-sm font-semibold text-gray-900">Nhu Cassel</h4>
                    <div class="text-[13px]">Hello Lauren 👋, · 24 Mar</div>
                </div>
            </div>
        </button>
        <button class="w-full text-left py-2 focus:outline-none focus-visible:bg-indigo-50">
            <div class="flex items-center">
                <img class="rounded-full items-start flex-shrink-0 mr-3" src="https://res.cloudinary.com/dc6deairt/image/upload/v1638102932/user-32-03_uzwykl.jpg" width="32" height="32" alt="Patrick Friedman" />
                <div>
                    <h4 class="text-sm font-semibold text-gray-900">Patrick Friedman</h4>
                    <div class="text-[13px]">Yes, you’re right but… · 14 Mar</div>
                </div>
            </div>
        </button>
        <button class="w-full text-left py-2 focus:outline-none focus-visible:bg-indigo-50">
            <div class="flex items-center">
                <img class="rounded-full items-start flex-shrink-0 mr-3" src="https://res.cloudinary.com/dc6deairt/image/upload/v1638102932/user-32-04_ttlftd.jpg" width="32" height="32" alt="Byrne McKenzie" />
                <div>
                    <h4 class="text-sm font-semibold text-gray-900">Byrne McKenzie</h4>
                    <div class="text-[13px]">Hey Lauren ✨, first of all… · 14 Mar</div>
                </div>
            </div>
        </button>
        <button class="w-full text-left py-2 focus:outline-none focus-visible:bg-indigo-50">
            <div class="flex items-center">
                <img class="rounded-full items-start flex-shrink-0 mr-3" src="https://res.cloudinary.com/dc6deairt/image/upload/v1638102932/user-32-05_bktgmb.jpg" width="32" height="32" alt="Scott Micheal" />
                <div>
                    <h4 class="text-sm font-semibold text-gray-900">Scott Micheal</h4>
                    <div class="text-[13px]">No way 🤙! · 11 Mar</div>
                </div>
            </div>
        </button>
    </div> */}
      </div>
    </div>
  )
}
export default Chat
