import Router from 'next/router'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Dialog, Transition } from '@headlessui/react'

import { faComment, faHeart } from '@fortawesome/free-regular-svg-icons'

import Image from 'next/image'
import axios from '../api/axios'
import React, { useEffect, useState, Fragment, useContext, useRef } from 'react'

import { ToastContainer, toast } from 'react-toastify'
import { FaEthereum } from 'react-icons/fa'
import { AuthContext } from '../context/authContext'
import { useMoralisWeb3Api } from 'react-moralis'

const ViewPosts = ({
  data,
  handleChange,
  mode,
  setData,
  bids,
  handlegetBids,
  scroll
}) => {
  const [show, setshow] = useState(false)
  const [id, setId] = useState(0)
  const [price, setPrice] = useState(0)
  const [error, setError] = useState('')
  const scrollRef = useRef()
  const { currentAccount, authenticate } = useContext(AuthContext)
  useEffect(() => {
    console.log(data, '-------------------mode', mode)
    if (mode == 2) {
      handlegetBids()
      // fetchNFTS()
    }
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behaviour: 'smooth' })
    }
  }, [mode, scrollRef])

  const handleLike = (index) => {
    console.log(index)
    axios
      .post('/v1/like-post', {
        id: data[index].id
      })
      .then((res) => {
        data[index].likes.push(res.data)
        data[index].liked = true
        setData(data)
      })
      .catch((er) => {
        console.log(er)
      })
    handleChange()
  }

  const styles = {
    error: ' border-red-2',
    errorText: 'text-red-500 text-xl'
  }

  const handleSubmit = () => {
    if (price < data[0].price) {
      setError('Amount Should be more then the last bid')
      return 0
    }
    axios
      .post('/v1/bid', {
        id: data[0].id,
        price: price
      })
      .then((res) => {
        toast('Bid Placed')
      })
      .catch((err) => {
        if (err.data?.message) {
          setError(err.data.message)
        }
        console.log(err)
      })
    setshow(false)

    handlegetBids()
  }

  const fetchNFTS = async () => {
    const web3api = useMoralisWeb3Api()

    const testnet = await web3api.Web3API.account.getNFTs({
      chain: 'rinkeby',
      address: currentAccount
    })
    console.log(testnet, 'nft')
  }
  return (
    <>
      <ToastContainer
        closeOnClick
        autoClose={5000}
        className='text-lg '
        pauseOnHover={false}
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
                    <input
                      value={price}
                      onChange={(e) => {
                        setPrice(e.target.value)
                      }}
                      className='m-2 p-2 text-2xl shadow-sm'
                    />
                    <button
                      onClick={handleSubmit}
                      className='m-3 rounded-lg bg-amber-800 p-3 text-2xl text-white shadow-md'
                    >
                      Bid
                    </button>

                    <label className={styles.errorText}>{error}</label>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
      {data.length > 0 ? (
        data.map((value, key) => (
          <div
            key={key}
            className='my-3  rounded-2xl p-6 shadow-md'
            ref={key == scroll ? scrollRef : undefined}
          >
            <div className='flex flex-row justify-center '>
              <Image
                src={`data:image/${value.type};base64,${value.img}`}
                alt='myimage'
                width={value.dim.width / 3}
                height={value.dim.height / 3}
              />
            </div>
            {mode == 1 ? (
              <>
                {' '}
                <div className='mt-4 flex flex-row justify-around'>
                  <button onClick={() => handleLike(key)}>
                    {' '}
                    <FontAwesomeIcon
                      className={
                        (value.liked ? 'text-red-600' : 'text-blue-300') +
                        ' text-3xl hover:opacity-50'
                      }
                      icon={faHeart}
                    />
                  </button>
                  <button
                    onClick={() => {
                      Router.push(`/private/comments/${value.id}`)
                    }}
                  >
                    <FontAwesomeIcon
                      className='text-3xl hover:opacity-50'
                      icon={faComment}
                    />
                  </button>
                </div>
                <div>
                  <label className='text-lg'>{value.desc}</label>
                </div>
                <div className='flex flex-row'>
                  <div id='likes' className='mr-10'>
                    <labels>{value.likes} likes</labels>
                  </div>
                  <div>
                    <labels>{value.comments} comments </labels>
                  </div>
                </div>
              </>
            ) : (
              <div className='mt-2 flex flex-row justify-between'>
                <div className='flex flex-row items-center'>
                  <label className='text-2xl text-black'>
                    <FontAwesomeIcon
                      icon={FaEthereum}
                      className='text-3xl text-black'
                    />{' '}
                    {value.price} eth
                  </label>
                </div>
                <button
                  onClick={() => {
                    setPrice(value.price)
                    setshow(true)
                  }}
                  className='w-36 rounded-lg bg-blue-500 p-2 text-3xl text-white'
                >
                  Bid
                </button>
              </div>
            )}
          </div>
        ))
      ) : (
        <></>
      )}
      {mode == 2 ? (
        <div className='m-4 flex w-full flex-col '>
          <div className='flex flex-row justify-center'>
            <label className='text-2xl text-black'>Offers</label>
          </div>

          <div className='mx-4 flex-1 flex-row rounded-lg bg-white p-4 shadow-md '>
            {bids.length > 0 ? (
              bids.map((value, key) => (
                <div className='flex flex-row justify-between p-2'>
                  <label className='text-2xl text-black'>{value.address}</label>
                  <label className='text-2xl text-black'>
                    {value.price} eth
                  </label>
                </div>
              ))
            ) : (
              <label className='text-black'> Be the first one to bid</label>
            )}
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  )
}
export default ViewPosts
