import { faUser } from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Image from 'next/image'
import React from 'react'

const Followers = ({ data, handleFollowUser }) => {
  return (
    <div className='flex flex-col p-2 h-screen'>
      {data.map((value, key) => (
        <div className='flex flex-row justify-between px-2'>
          <div className='flex flex-row'>
            <div
              className={
                'rounded-full bg-slate-300 shadow-lg flex flex-row justify-center items-center ' +
                (value?.img ? '' : 'p-5')
              }
            >
              {value?.img ? (
                <Image
                  src={`data:image/${value.type};base64,${value.image}`}
                  alt='myimage'
                  width={130}
                  height={130}
                  className='rounded-full'
                />
              ) : (
                <FontAwesomeIcon
                  color='black'
                  icon={faUser}
                  className='w-  text-9xl text-gray-500'
                />
              )}
            </div>
            <label className='mx-1 text-2xl '>{value.username}</label>
          </div>
          <button
            onClick={handleFollowUser}
            className={
              'rounded-lg p-2 px-5 text-2xl hover:opacity-70 ' +
              (data.follow == 2 ? styles.follow : styles.unfollow)
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
        </div>
      ))}
    </div>
  )
}
export default Followers
