import React, { Fragment, useContext, useEffect, useRef, useState } from 'react'
import axios from '../../../api/axios'
import { AuthContext } from '../../../context/authContext'
import Router, { useRouter } from 'next/router'
import toast, { Toaster } from 'react-hot-toast'
import EditUserProfile from '../editprofile/editprofile'
import { faEdit, faUser } from '@fortawesome/free-regular-svg-icons'
import ProfilePost from '../../../components/profileposts/ProfilePosts'
import { Dialog, Transition } from '@headlessui/react'
import Image from 'next/image'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const Profile = () => {
  //const {currentAccount,authenticate} = useContext(AuthContext)

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

  const [mode, setMode] = useState(1)
  const [data, setData] = useState({
    posts: []
  })
  const router = useRouter()
  const id = router.query.id
  useEffect(() => {
    getProfile()
  }, [])

  const uploadProfilePicture = (img, mode) => {
    const formData = new FormData()
    if (mode == 1) {
      const image = img.target.files[0]

      let filename = image.name.split('.')

      formData.append(
        'image',

        image
      )
      formData.append('type', filename[1].split(' ')[0])
      formData.append('name', filename[0])
    }

    formData.append('mode', mode)

    axios
      .post('/v1/upload-profile-picture', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      .then((res) => {
        if (mode == 1) {
          toast.success('Profile picture updated')
        } else {
          toast.success('Profile picture has been removed')
        }
        getProfile()
      })
      .catch((err) => {
        toast(err.response.data.msg)
        console.log(err.response.data)
      })
  }

  const getProfile = () => {
    axios
      .get('/v1/get-profile/1')
      .then((res) => {
        setData(res.data)
      })
      .catch((err) => console.log(err))
  }

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
          reload={getProfile}
        />
      ) : (
        <></>
      )}
      <EditUserProfile
        show={show1}
        setshow={setShow1}
        reload={getProfile}
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
          <div className='mx-auto mt-5 flex w-full flex-row justify-center  space-x-16 p-4 md:justify-around md:space-x-0 lg:w-3/5'>
            <div className=''>
              <button
                onClick={() => {
                  setshow(true)
                }}
                className={
                  'mt-2 flex w-max flex-col rounded-full bg-orange-600 p-1 shadow-md' +
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
              <div className=' my-3 md:block '>
                <p className='break-words text-2xl text-gray-500'>
                  {data.desc}
                </p>
              </div>
            </div>
          </div>
        </div>
        <ul className=' mx-auto mt-5 flex flex-row items-center justify-evenly  space-x-8 lg:w-3/5 lg:justify-end'>
          <li className='flex flex-col items-center text-2xl'>
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
            className='flex flex-col items-center rounded-md p-2 text-2xl text-black hover:opacity-60'
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
            className='flex flex-col items-center rounded-md p-2 text-2xl text-black hover:opacity-60'
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
        <div className='mb-8 w-full lg:mx-auto lg:w-8/12'>
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
                    setMode(1)
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
                    setMode(2)
                  }}
                  className='inline-block p-3'
                  href='#'
                >
                  <i className='far fa-square '></i>
                  <span className=' text-2xl md:inline'>NFTS</span>
                </button>
              </li>
            </ul>
            <ProfilePost mode={mode} setCount={setCount} />
          </div>
        </div>
      </main>
    </>
  )
}
export default Profile
