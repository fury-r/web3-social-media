import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Image from 'next/image'
import {
  faComment,
  faEdit,
  faHeart,
  faUser
} from '@fortawesome/free-regular-svg-icons'
import Router from 'next/router'
import { Dialog, Transition } from '@headlessui/react'

import { faList, faPlus } from '@fortawesome/free-solid-svg-icons'
import AccountAction from './AccountActions'
import React, { useState, useRef, Fragment, useContext, useEffect } from 'react'
import EditUserProfile from '../pages/private/editprofile/editprofile'
import toast, { Toaster } from 'react-hot-toast'
import { AuthContext } from '../context/authContext'
import { useMoralisWeb3Api } from 'react-moralis'
import ProfilePost from './profileposts/ProfilePosts'

const ProfileComponent = ({
  data,
  handlePost,
  mode,
  handleFollowUser,
  reload,
  uploadProfilePicture,
  user,
  setData,
  web3api
}) => {
  //const {currentAccount,authenticate} = useContext(AuthContext)

  useEffect(() => {
    if (mode == 2) {
      //   fetchNFTS()
    }
  }, [mode])
  const styles = {
    activeStyle: 'md:border-t md:border-gray-700 md:-mt-px md:text-gray-700',
    follow: 'bg-blue-500 text-white',
    unfollow: 'bg-white  border-2 ',
    actionStyle: 'shadow-sm text-2xl p-5 hover:opacity-25 font-semibold  ',
    red: 'text-red-500',
    button: ' my-4 text-3xl'
  }

  const [showMenu, setShowMenu] = useState(false)
  const [show1, setShow1] = useState(false)

  const [show, setshow] = useState(false)
  const inputFile = useRef(1)
  const [count, setCount] = useState(0)

  return (
    <>
      {mode > 2 ? (
        <AccountAction
          showMenu={showMenu}
          setShowMenu={setShowMenu}
          data={{
            blocked: data.blocked,
            restricted: data.restricted,
            username: data.username
          }}
          reload={reload}
        />
      ) : (
        <></>
      )}
      <EditUserProfile
        show={show1}
        setshow={setShow1}
        reload={reload}
        toast={toast}
        data={data}
        setData={setData}
      />
      <Transition appear show={show} as={Fragment}>
        <Dialog
          as='div'
          className='relative z-10'
          onClose={() => setshow(false)}
        >
          <Transition.Child
            as={Fragment}
            enter='ease-out duration-300'
            enterFrom='opacity-0'
            enterTo='opacity-100'
            leave='ease-in duration-200'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'
          >
            <div className='fixed inset-0 bg-black bg-opacity-25' />
          </Transition.Child>

          <div className='fixed inset-0 overflow-y-auto'>
            <div className='flex min-h-full items-center justify-center p-4 text-center'>
              <Transition.Child
                as={Fragment}
                enter='ease-out duration-300'
                enterFrom='opacity-0 scale-95'
                enterTo='opacity-100 scale-100'
                leave='ease-in duration-200'
                leaveFrom='opacity-100 scale-100'
                leaveTo='opacity-0 scale-95'
              >
                <Dialog.Panel className='w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all'>
                  <div className='flex flex-col justify-around'>
                    {data.profile_pic ? (
                      <button
                        onClick={() => {
                          uploadProfilePicture(0, 0)
                          setshow(false)
                        }}
                        className={'text-red-500 ' + styles.button}
                      >
                        Delete Profile Picture
                      </button>
                    ) : (
                      <></>
                    )}
                    <button
                      onClick={() => {
                        inputFile.current.click()
                        setshow(false)
                      }}
                      className={'text-gray-500 ' + styles.button}
                    >
                      {data?.image
                        ? 'Change profile picture'
                        : 'Upload a profile picture'}
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
      <Toaster />

      <main className='h-screen bg-gray-100 bg-opacity-25'>
        <div className='w-full'>
          <div className='flex flex-row md:justify-around w-full space-x-16 md:space-x-0  p-4 mt-5 lg:w-3/5 mx-auto justify-center'>
            <div className=''>
              <button
                onClick={() => {
                  setshow(true)
                }}
                className={
                  'flex flex-col bg-orange-600 shadow-md rounded-full p-1 mt-2 w-max' +
                  (data?.image ? '' : 'p-5 sm:p-2 md:p-2 ')
                }
              >
                {data?.image ? (
                  <Image
                    src={`data:image/${data.type};base64,${data.image}`}
                    alt='myimage'
                    width={100}
                    height={100}
                    className='rounded-full bg-white '
                  />
                ) : (
                  <FontAwesomeIcon
                    color='black'
                    icon={faUser}
                    className='w-  text-9xl text-gray-500'
                  />
                )}
              </button>
            </div>

            <div className='flex flex-col justify-center md:w-1/2'>
              <input
                style={{ display: 'none' }}
                ref={inputFile}
                onChange={(e) => {
                  uploadProfilePicture(e, 1)
                  setshow(false)
                }}
                type='file'
                accept='image/*'
              />

              <h2 className='inline-block text-3xl font-light sm:mb-0 md:mr-2  '>
                {data.username}
              </h2>
              <div className=' md:block my-3 '>
                <p className='break-words text-2xl text-gray-500'>
                  {data.desc}
                </p>
              </div>
            </div>
          </div>
        </div>
        <ul className=' flex flex-row items-center space-x-8 mx-auto lg:w-3/5  lg:justify-end justify-evenly mt-5'>
          <li className='text-2xl flex flex-col items-center'>
            <span className='font-semibold'>{count} </span>
            <span className='text-gray-500'>
              {' '}
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
                query: { id: '0', mode: 2 }
              })
            }}
            className='rounded-md p-2 text-2xl text-black hover:opacity-60 flex flex-col items-center'
          >
            <span className='font-semibold'>{data.followers} </span>
            <span className='text-gray-500'>
              {data.followers == 1 ? 'follower' : 'followers'}
            </span>
          </button>
          <button
            onClick={() => {
              Router.push({
                pathname: '/private/users/users',
                query: { id: '0', mode: 1 }
              })
            }}
            className='rounded-md p-2 text-2xl text-black hover:opacity-60 flex flex-col items-center'
          >
            <span className='font-semibold '>{data.following} </span>
            <span className='text-gray-500'>following</span>
          </button>
          <button
            className='text-gray-500 hover:opacity-50'
            onClick={() => setShow1(true)}
          >
            <FontAwesomeIcon className='text-4xl' icon={faEdit} />
          </button>
        </ul>
        <div className='mb-8 lg:mx-auto lg:w-8/12 w-full'>
          <header className='flex flex-wrap items-center p-4 md:py-8 '>
            {/* <div className="my-2 text-sm md:hidden">
              <h1 className="font-semibold">Mr Travlerrr...</h1>
              <span>Travel, Nature and Music</span>
              <p>Lorem ipsum dolor sit amet consectetur</p>
            </div> */}
          </header>

          <div className='px-px md:px-3'>
            <ul
              className='flex items-center justify-around space-x-12 border-t  
                            text-xs font-semibold uppercase tracking-widest text-gray-600
                            md:justify-center'
            >
              <li className={mode == 1 ? styles.activeStyle : ''}>
                <button
                  onClick={() => {
                    Router.push('/private/profile/profile', { id: mode + 1 })
                  }}
                  className='inline-block p-3'
                  href='#'
                >
                  <i className='fas fa-th-large   text-2xl '></i>
                  <span className=' text-2xl md:inline  '>POSTS</span>
                </button>
              </li>
              <li className={mode == 2 ? styles.activeStyle : ''}>
                <button
                  onClick={() => {
                    Router.push('/private/profile/nftview')
                  }}
                  className='inline-block p-3'
                  href='#'
                >
                  <i className='far fa-square '></i>
                  <span className=' text-2xl md:inline'>NFTS</span>
                </button>
              </li>
            </ul>

            <div className='-mx-px flex flex-wrap md:-mx-3'>
              <div className='w-1/3 p-px md:px-3'>
                <a href='#'>
                  <article className='post pb-full relative bg-gray-100 text-white md:mb-6'>
                    <i className='fas fa-square absolute right-0 top-0 m-1'></i>
                    <div
                      className='overlay absolute left-0 top-0 hidden h-full 
                                        w-full bg-gray-800 bg-opacity-25'
                    >
                      <div
                        className='flex h-full items-center 
                                            justify-center space-x-4'
                      >
                        <span className='p-2'>
                          <i className='fas fa-heart'></i>
                          412K
                        </span>

                        <span className='p-2'>
                          <i className='fas fa-comment'></i>
                          2,909
                        </span>
                      </div>
                    </div>
                  </article>
                </a>
              </div>

              <div className='w-1/3 p-px md:px-3'>
                <a href='#'>
                  <article className='post pb-full relative bg-gray-100 text-white  md:mb-6'>
                    <div
                      className='overlay absolute left-0 top-0 hidden h-full 
                                        w-full bg-gray-800 bg-opacity-25'
                    >
                      <div
                        className='flex h-full items-center 
                                            justify-center space-x-4'
                      >
                        <span className='p-2'>
                          <i className='fas fa-heart'></i>
                          112K
                        </span>

                        <span className='p-2'>
                          <i className='fas fa-comment'></i>
                          2,090
                        </span>
                      </div>
                    </div>
                  </article>
                </a>
              </div>

              <div className='w-1/3 p-px md:px-3'>
                <a href='#'>
                  <article className='post pb-full relative bg-gray-100 text-white md:mb-6'>
                    <i className='fas fa-video absolute right-0 top-0 m-1'></i>

                    <div
                      className='overlay absolute left-0 top-0 hidden h-full 
                                        w-full bg-gray-800 bg-opacity-25'
                    >
                      <div
                        className='flex h-full items-center 
                                            justify-center space-x-4'
                      >
                        <span className='p-2'>
                          <i className='fas fa-heart'></i>
                          841K
                        </span>
                      </div>
                    </div>
                  </article>
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
export default ProfileComponent
