import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useState, Fragment, useContext, useEffect } from 'react'
import Router from 'next/router'
import { Dialog, Transition } from '@headlessui/react'
import axios from '../api/axios'
import { AuthContext } from '../context/authContext'
import { Switch } from '@headlessui/react'
import { faInbox } from '@fortawesome/free-solid-svg-icons'
import { IoOptionsSharp } from 'react-icons/io5'
const Navbar = () => {
  const [show, setshow] = useState(false)
  const {
    connectWallet,
    currentAccount,
    isAuthenticated,
    format,
    formattedAccount
  } = useContext(AuthContext)

  const [enabled, setEnabled] = useState(false)

  const handleLogout = () => {
    axios
      .get('/v1/logout')
      .then((res) => {
        localStorage.removeItem('token')
        setshow(false)
        Router.push('/login/login')
      })
      .catch((err) => {
        console.log(err)
      })
  }

  const styles = {
    button: ' my-4 text-3xl'
  }

  useEffect(() => {
    getVisibility()
  }, [])
  const handleConnectWallet = async () => {
    await connectWallet()
  }

  // if (currentAccount.length>0){
  //   axios.post("/v1/connect-wallet",{
  //     address:currentAccount
  //   })
  //   .then((res)=>{
  //     localStorage.removeItem("token")
  //     setshow(false)
  //     Router.push("/login/login")
  //   })
  //   .catch((err)=>{
  //     console.log(err)
  //   })
  // }
  const handleDiary = (mode) => {
    if (mode == 0) {
      Router.push('/private/diary/viewdiary')
    } else {
    }
    setshow(false)
  }

  const getVisibility = () => {
    axios
      .get('/v1/get-visibility')
      .then((res) => {
        setEnabled(res.data.visible)
      })
      .catch((err) => {
        console.log(err)
      })
  }
  const changeVisbility = () => {
    setEnabled(!enabled)
    axios
      .post('/v1/change-visibility', {
        visible: !enabled
      })

      .catch((err) => {
        console.log(err)
      })
  }
  return (
    <div className='fixed top-0 z-50 w-full bg-white '>
      <div className='flex flex-1 content-center items-center justify-between  p-4 shadow-sm'>
        <button className='m-2 p-2'>
          <label className='text-xl font-bold '>Leylines</label>
        </button>
        <div className='flex flex-row '>
          <Switch
            checked={enabled}
            className=' rounded-3xl '
            onChange={changeVisbility}
          >
            <span className='block  h-10 w-20 rounded-3xl bg-white p-2 shadow'>
              <span
                className={`block h-full w-1/2  transform   rounded-3xl transition duration-300 ease-in-out ${
                  enabled ? 'translate-x-full bg-green-500' : 'bg-gray-500'
                }`}
              ></span>
            </span>
            <span className=''>
              {' '}
              {enabled && 'Online'}
              {!enabled && 'Offline'}
            </span>
          </Switch>
        </div>
        <div className='flex flex-row items-center'>
          <button className='m-2 p-2' onClick={() => setshow(true)}>
            <IoOptionsSharp className='text-4xl hover:text-red-500' />
          </button>
          <button
            className='0 m-2'
            onClick={() => {
              Router.push('/private/chat/chat')
            }}
          >
            <FontAwesomeIcon
              className='text-4xl hover:text-red-500'
              icon={faInbox}
            />
          </button>
        </div>
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
                      <button
                        onClick={handleConnectWallet}
                        className={styles.button}
                      >
                        Connect Wallet
                      </button>
                      <button
                        onClick={() => handleDiary(0)}
                        className={styles.button}
                      >
                        View Diary
                      </button>

                      <button
                        onClick={() => {
                          Router.push('/private/spyChecker/spyChecker')
                          setshow(false)
                        }}
                        className={styles.button}
                      >
                        ProfileViewer
                      </button>
                      <button
                        onClick={() => {
                          Router.push('/private/settings/privacy')
                          setshow(false)
                        }}
                        className={styles.button}
                      >
                        Privacy Settings
                      </button>
                      <button
                        onClick={handleLogout}
                        className={'text-red-500 ' + styles.button}
                      >
                        Log out
                      </button>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>
      </div>
    </div>
  )
}
export default Navbar
