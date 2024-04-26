import Router from 'next/router'
import React, { Fragment, useState } from 'react'
import axios from '../../../../api/axios'
import { Combobox, Transition } from '@headlessui/react'

const Search = () => {
  const [data, setData] = useState([])

  const handleSearch = (e) => {
    const search = e.target.value
    console.log(search)
    axios
      .post('/v1/search', {
        search
      })
      .then((res) => {
        setData(res.data)
      })
      .catch((e) => {
        console.log(e)
      })
  }

  const followUser = (username, follow) => {
    axios
      .post('/v1/follow-user', {
        username,
        follow
      })
      .catch((e) => {
        console.log(e.response.data)
      })
  }

  const handleViewProfile = (key) => {
    console.log(key, data[key])
    Router.push({
      pathname: '/private/viewprofile/viewprofile',
      query: { id: data[key].id, mode: 1 }
    })
  }

  return (
    <div className='flex flex-col justrify-start content-center items-center bg-slate-100 h-screen mt-6 '>
      <Combobox className='w-full p-4' onChange={() => {}}>
        <div className='relative mt-1 '>
          <div className='relative w-full cursor-default overflow-hidden rounded-3xl bg-white text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm'>
            <Combobox.Input
              className='w-full border-none h-20 py-2 pl-3 pr-10 text-2xl leading-5 text-gray-900 focus:ring-0'
              // displayValue={(person) => person.username}
              placeholder='Search'
              onChange={handleSearch}
            />
            <Combobox.Button className='absolute inset-y-0 right-0 flex items-center pr-2'></Combobox.Button>
          </div>
          <Transition
            as={Fragment}
            leave='transition ease-in duration-100'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'
          >
            <Combobox.Options className=' mt-1 max-h-60 w-full  rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm'>
              {data.length == 0 ? (
                <div className='relative cursor-default select-none py-2 px-4 text-gray-700 text-2xl'>
                  Nothing found.
                </div>
              ) : (
                data.map((value, key) => (
                  <Combobox.Option
                    key={key}
                    onClick={() => handleViewProfile(key)}
                    className={({ active }) =>
                      `relative cursor-default select-none py-2 pl-10 pr-4 flex flex-row justify-between ${
                        active ? 'bg-teal-600 text-white' : 'text-gray-900'
                      }`
                    }
                    value={value.username}
                  >
                    <>
                      <span className={`block truncate text-3xl`}>
                        {value.username}{' '}
                      </span>
                      <span className={`block truncate text-3xl`}>
                        {value.follow == 0
                          ? 'Following'
                          : value.follow == 1
                            ? 'Request sent'
                            : 'Follow'}{' '}
                      </span>
                    </>
                  </Combobox.Option>
                ))
              )}
            </Combobox.Options>
          </Transition>
        </div>
      </Combobox>
    </div>
  )
}
export default Search
