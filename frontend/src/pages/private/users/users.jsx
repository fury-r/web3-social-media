import Router, { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import axios from '../../../api/axios'
import { faUser } from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Image from 'next/image'

const Users = () => {
  const router = useRouter()
  const [data, setData] = useState([])

  useEffect(() => {
    getUsers()
  }, [])

  const getUsers = () => {
    console.log(router.query)
    axios
      .post('/v1/user-list', {
        mode: router.query.mode,
        id: router.query.id
      })
      .then((res) => {
        setData(res.data)
      })
      .catch((err) => {
        console.log(err)
      })
  }

  const followUser = (follow, username) => {
    console.log(data)
    axios
      .post('/v1/follow-user', {
        username,
        follow
      })
      .catch((e) => {
        console.log(e.response.data)
      })
    getProfile()
  }
  const styles = {
    follow: 'bg-blue-500 text-white',
    unfollow: 'bg-white  border-2 '
  }
  const handleViewProfile = (key) => {
    Router.push({
      pathname: '/private/viewprofile/viewprofile',
      query: { user: data[key].username, mode: 1 }
    })
  }
  return (
    <div className='flex flex-col p-2 h-screen'>
      <label className='m-4 text-3xl font-medium my-2'>
        {router.query.mode == 1 ? 'Following' : 'Followers'}
      </label>
      {data.length > 0 ? (
        data.map((value, key) => (
          <button
            onClick={() => handleViewProfile(key)}
            key={key}
            className='flex flex-row justify-between p-3 items-center shadow-sm bg-white'
          >
            <div className='flex flex-row items-center'>
              <div
                className={
                  'rounded-full bg-slate-300 shadow-sm flex flex-row justify-center items-center ' +
                  (value?.img ? '' : 'p-5')
                }
              >
                {value?.img ? (
                  <Image
                    src={`data:image/${value.type};base64,${value.image}`}
                    alt='myimage'
                    width={50}
                    height={50}
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
              <label className='mx-5 text-2xl '>{value.username}</label>
            </div>
            <button
              onClick={() => followUser(value.username, value.follow)}
              className={
                'rounded-lg p-2 px-5 text-2xl hover:opacity-70 h-14 ' +
                (value.follow == 2 ? styles.follow : styles.unfollow)
              }
            >
              {data.follow == 0
                ? 'Follow'
                : data.follow == 1
                  ? 'Follow back'
                  : data.follow == 3
                    ? 'requests sent'
                    : 'following'}
            </button>
          </button>
        ))
      ) : (
        <></>
      )}
    </div>
  )
}
export default Users
