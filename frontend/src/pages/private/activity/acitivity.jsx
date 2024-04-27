import React, { Fragment, useContext, useEffect, useState } from 'react'
import { Button } from 'react-bootstrap'
import axios from '../../../api/axios'
import Router from 'next/router'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser } from '@fortawesome/free-regular-svg-icons'
import Moralis from 'moralis'

import { Dialog, Transition } from '@headlessui/react'
import Image from 'next/image'
import { AuthContext } from '../../../context/authContext'
import { useWeb3Transfer } from 'react-moralis'
import axiosInstance from '../../../api/axios'
import { Oval } from 'react-loader-spinner'
const Activity = () => {
  const [count, setCount] = useState(0)
  const [data, setData] = useState([])
  const [show, setShow] = useState(false)
  const { setProps, enableWeb3, authenticate } = useContext(AuthContext)
  const [selected, setSelected] = useState(0)
  const [id, setId] = useState({})
  const [loading, setLoading] = useState(false)
  const styles = {
    activeStyle: 'md:border-t md:border-gray-700 md:-mt-px md:text-gray-700',
    follow: 'bg-blue-500 text-white',
    unfollow: 'bg-white  border-2 ',
    actionStyle: 'shadow-sm text-2xl p-5 hover:opacity-25 font-semibold  ',
    red: 'text-red-500',
    button: ' my-4 text-3xl'
  }
  useEffect(() => {
    handleGetRequestCount()
    getActivity()
  }, [])

  const handleGetRequestCount = () => {
    axios
      .get('/v1/get-requests-count')
      .then((res) => {
        setCount(res.data)
      })
      .catch((err) => {
        console.log(err)
      })
  }

  const getActivity = async () => {
    await setLoading(true)

    await axios
      .get('/v1/get-activity')
      .then((res) => {
        console.log(res.data)
        setData(res.data)
      })
      .catch((err) => {
        console.log(err)
      })
    await setLoading(false)
  }

  const handleAction = (mode) => {
    console.log(id)
    if (mode == 1) {
      axios
        .get('/v1/delete-activity/' + id.id)
        .then((res) => {
          console.log(res)
          getActivity()
        })
        .catch((err) => {
          console.log(err)
        })
    } else if (mode == 2) {
      setProps([id])

      Router.push({ pathname: '/private/profile/postDetails/postDetails' })
    }
    setShow(false)
  }

  const handleTransfer = async () => {
    //const web3=await enableWeb3()
    // await fetch()
    console.log(data[selected])

    await enableWeb3()
    //await authenticate()
    const transaction = await Moralis.transfer({
      type: 'native',
      network: 'rinkeby',
      amount: Moralis.Units.ETH(data[selected]?.bid),
      receiver: data[selected]?.address
    })

    const result = await transaction.wait(1)
    if (result.status == 1) {
      handlePaymentsucccess({
        id: data[selected]?.bid_id,
        transfer: result
      })
    }
  }

  const handlePaymentsucccess = (value) => {
    axiosInstance.post('/v1/bid/payment', value).catch((err) => {
      console.log(err.reponse.data)
    })
  }
  return (
    <div className='h-screen'>
      <Transition appear show={show} as={Fragment}>
        <Dialog
          as='div'
          className='relative z-10'
          onClose={() => setShow(false)}
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
                <Dialog.Panel className=' w-1/2 transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all'>
                  {data.length > 0 && id?.type == 5 && id?.status == 1 ? (
                    <div className='o-4 flex flex-col justify-center'>
                      <label className='text-center text-2xl'>
                        Transfer {id.bid} eth to {id.address}
                      </label>

                      <button
                        onClick={() => {
                          handleTransfer()
                        }}
                        className={
                          'rounded-md bg-blue-400 p-4 text-2xl font-bold text-white shadow-md' +
                          styles.button
                        }
                      >
                        Send
                      </button>
                    </div>
                  ) : (
                    <div className='flex flex-col justify-around'>
                      <button
                        onClick={() => {
                          handleAction(1)
                        }}
                        className={'text-red-500 ' + styles.button}
                      >
                        Delete notification
                      </button>

                      <button
                        onClick={() => {
                          handleAction(2)
                        }}
                        className={'text-gray-500 ' + styles.button}
                      >
                        {}
                      </button>
                    </div>
                  )}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
      <div>
        {count > 0 ? (
          <Button
            className='w-full  bg-slate-800'
            onClick={() => {
              Router.push('/private/activity/requests/requests')
            }}
          >
            You have {count} {count == 1 ? 'Request' : 'Requests'}
          </Button>
        ) : (
          <></>
        )}
      </div>
      <div className='m-2 flex flex-1 flex-col  bg-white'>
        {loading ? (
          <div className='flex min-h-screen flex-1 flex-col items-center justify-center'>
            <Oval
              height={50}
              width={50}
              color='black'
              wrapperStyle={{}}
              wrapperClass=''
              visible={true}
              ariaLabel='oval-loading'
              secondaryColor='black'
              strokeWidth={4}
              strokeWidthSecondary={4}
            />
          </div>
        ) : data.length > 0 ? (
          data.map((value, key) => (
            <button
              onClick={() => {
                setId(data[key])
                setShow(true)
              }}
              key={key}
              className='flex  flex-row items-center justify-between p-3 shadow-md hover:opacity-50 '
            >
              <div className='flex flex-row items-center'>
                <div className='rounded-full p-3 shadow-sm'>
                  {value?.image ? (
                    <Image
                      src={`data:image/${value.type};base64,${value.image}`}
                      alt='myimage'
                      width={40}
                      height={40}
                      className='rounded-full'
                    />
                  ) : (
                    <FontAwesomeIcon
                      color='black'
                      icon={faUser}
                      className='w-  text-6xl text-gray-500'
                    />
                  )}
                </div>

                <label className='mx-5 text-2xl'>
                  {value.username} {value.message}
                </label>
              </div>

              <label className='font-mono text-xl'>{value.time}</label>
            </button>
          ))
        ) : (
          <div className=' flex flex-1 flex-col justify-center items-center min-h-screen'>
            <label className='text-2xl font-bold'>No notifications Found</label>
          </div>
        )}
      </div>
    </div>
  )
}
export default Activity
