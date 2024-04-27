import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../../context/authContext'
import Router, { useRouter } from 'next/router'
import UserPosts from '../../../components/profileposts/UserProfilePost'
import AccountAction from '../../../components/AccountActions'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Image from 'next/image'

import {
  faList,
  faImage,
  faUser,
  faUserFriends
} from '@fortawesome/free-solid-svg-icons'

import axios from '../../../api/axios'

const Profile = () => {
  const { props, setProps } = useContext(AuthContext)
  const [count, setCount] = useState(0)
  const [data, setData] = useState({
    posts: []
  })
  const router = useRouter()
  const user = router.query.id
  const [mode, setMode] = useState(router.query.mode)
  useEffect(() => {
    console.log(router.query)
    getProfile(1)
  }, [])

  const getProfile = (mode) => {
    console.log(mode, 'MODE')
    axios
      .post('/v1/get-user-profile', {
        user,
        mode: mode
      })
      .then((res) => {
        console.log(res.data)

        setData(res.data)
      })
      .catch((err) => console.log(err.response.data))
  }

  const handleViewPost = (key, mode) => {
    if (mode == 1) {
      Router.push({
        pathname: '/private/viewprofile/postDetails/postDetails',
        query: { id: user, mode: mode, key: key }
      })
    } else {
      Router.push({
        pathname: '/private/viewprofile/postDetails/nftDetails',
        query: { id: user, mode: mode, key: key }
      })
    }
  }

  const handleFollowUser = () => {
    console.log(data)
    axios
      .post('/v1/follow-user', {
        username: data.username,
        follow: data.follow
      })
      .catch((e) => {
        console.log(e.response.data)
      })
    getProfile(mode)
  }

  useEffect(() => {}, [mode])

  const styles = {
    activeStyle: 'md:border-t md:border-gray-700 md:-mt-px md:text-gray-700',
    follow: 'bg-blue-500 text-white',
    unfollow: 'bg-white  border-2 ',
    actionStyle: 'shadow-sm text-2xl p-5 hover:opacity-25 font-semibold  ',
    red: 'text-red-500',
    button: ' my-4 text-3xl',
    icon: 'rounded-xl shadow-md p-3 text-xl items-center text-white hover:opacity-60 w-64 flex flex-row justify-center items-center'
  }
  const [showMenu, setShowMenu] = useState(false)

  return (
    <>
      <AccountAction
        showMenu={showMenu}
        setShowMenu={setShowMenu}
        data={{
          blocked: data.blocked,
          restricted: data.restricted,
          username: data.username
        }}
        reload={getProfile}
        mode={mode}
      />
      <main className='h-screen bg-gray-100 bg-opacity-25 '>
        <div className='mb-8 h-screen lg:mx-auto lg:w-8/12 '>
          <header className=' flex flex-wrap items-center rounded-2xl bg-white p-5  md:py-8  '>
            <div className='flex flex-row justify-center p-10 sm:w-2/6 md:ml-16  md:w-3/12 '>
              <div
                className={
                  'flex flex-row items-center justify-center rounded-full bg-slate-300 shadow-lg ' +
                  (data?.image ? '' : 'p-5')
                }
              >
                {data?.image ? (
                  <Image
                    src={`data:image/${data.type};base64,${data.image}`}
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
                )}
              </div>
            </div>

            <div className='ml-4 w-8/12 md:w-7/12  flex flex-row items-center justify-between'>
              <h2 className='mb-2 inline-block text-3xl font-light sm:mb-0 md:mr-2'>
                {data.username}
              </h2>

              <div className='flex flex-row justify-end'>
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
                <button
                  onClick={() => {
                    setShowMenu(true)
                  }}
                  className='ms-5 rounded-xl p-2 text-3xl hover:text-blue-500 hover:shadow-md '
                >
                  <FontAwesomeIcon className='  ' icon={faList} />
                </button>
              </div>
            </div>
            <div className='m-4 hidden w-1/2 rounded-lg p-3 py-4   shadow-md md:block'>
              <span className='break-words text-2xl'>{data.desc}</span>
            </div>
            <div className='flex flex-col'>
              <ul className='mb-4 hidden items-center space-x-8 md:flex '>
                <li
                  className={
                    styles.icon +
                    ' bg-gradient-to-tl from-blue-500 via-purple-700 to-purple-700 '
                  }
                >
                  <FontAwesomeIcon className='mr-3' icon={faImage} />{' '}
                  <span className='text-2xl font-semibold'>
                    {count}{' '}
                    {mode == 1
                      ? count < 2
                        ? 'post'
                        : 'posts'
                      : count < 2
                        ? 'nft'
                        : 'nfts'}
                  </span>
                </li>
                <button
                  onClick={() => {
                    Router.push({
                      pathname: '/private/users/users',
                      query: { id: data.username, mode: 2 }
                    })
                  }}
                  className={
                    styles.icon +
                    ' bg-gradient-to-tl from-blue-500 via-purple-700 to-purple-700'
                  }
                >
                  <FontAwesomeIcon className='mr-3' icon={faUserFriends} />
                  <span className='font-semibold'>
                    {data.followers}{' '}
                    {data.followers == 1 ? 'follower' : 'followers'}
                  </span>
                </button>
                <button
                  onClick={() => {
                    Router.push({
                      pathname: '/private/users/users',
                      query: { id: data.username, mode: 1 }
                    })
                  }}
                  className={
                    styles.icon +
                    ' bg-gradient-to-tl from-blue-500 via-purple-700 to-purple-700 '
                  }
                >
                  <FontAwesomeIcon className='mr-3' icon={faUserFriends} />

                  <span className='font-semibold'>
                    {data.following} following
                  </span>
                </button>
              </ul>
            </div>
          </header>

          <div className='px-px md:px-3'>
            <ul
              className='flex justify-around space-x-8 border-t p-2 
                        text-center text-sm leading-snug text-gray-600 md:hidden'
            >
              <li>
                <span className='block font-semibold text-gray-800'>
                  {count}
                </span>
                {mode == 1 ? 'posts' : 'nfts'}
              </li>

              <li>
                <span className='block font-semibold text-gray-800'>
                  {data.followers}
                </span>
                followers
              </li>
              <li>
                <span className='block font-semibold text-gray-800'>
                  {data.following}
                </span>
                following
              </li>
            </ul>

            <ul
              className='flex items-center justify-around space-x-12 border-t  
                            text-xs font-semibold uppercase tracking-widest text-gray-600 bg-white
                            md:justify-center'
            >
              <li className={mode == 1 ? styles.activeStyle : ''}>
                <button
                  onClick={() => {
                    setMode(1)
                    getProfile(1)
                  }}
                  className='inline-block p-3'
                  href='#'
                >
                  <i className='fas fa-th-large text-xl md:text-xs'></i>
                  <span className=' text-2xl md:inline  '>POSTS</span>
                </button>
              </li>
              <li className={mode == 2 ? styles.activeStyle : ''}>
                <button
                  onClick={() => {
                    setMode(2)
                    getProfile(2)
                  }}
                  className='inline-block p-3'
                  href='#'
                >
                  <i className='far fa-square text-xl md:text-xs'></i>
                  <span className=' text-2xl md:inline  '>NFTS</span>
                </button>
              </li>
            </ul>

            <UserPosts
              setCount={setCount}
              addresss={data?.address}
              handleViewPost={handleViewPost}
              access={data?.access}
              id={router.query.id}
              mode={mode}
            />
          </div>
        </div>
      </main>
    </>
  )
}
export default Profile
