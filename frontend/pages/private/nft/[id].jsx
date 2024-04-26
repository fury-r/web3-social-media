import { useRouter } from 'next/router'
import React, { useContext, useEffect, useState } from 'react'
import axios from '../../../api/axios'
import { Switch } from '@headlessui/react'
import { AuthContext } from '../../../context/authContext'

import { ToastContainer, toast } from 'react-toastify'
import { contractABI, contractAddress } from '../../../contracts/contracts.js'
import Moralis from 'moralis'

const NFT = () => {
  const { currentAccount, props, enableWeb3 } = useContext(AuthContext)
  const [data, setData] = useState({
    bid: '',
    price: '',
    bids: []
  })
  const router = useRouter()

  useEffect(() => {
    getSettings()
  }, [])

  const getSettings = () => {
    // console.log(router.query.id)
    axios
      .get('/v1/get-nft-settings?id=' + router.query.id)
      .then((res) => {
        console.log(res.data)
        setData(res.data)
      })
      .catch((err) => {
        console.log(err.response.data)
      })
  }

  const styles = {
    textStyle: 'font-medium text-xl',
    row: ' flex flex-row justify-between shadow-sm my-2 p-3',
    on: 'bg-gray-500 translate-x-full ',
    off: 'bg-gray-300 ',
    toggle:
      'block h-full w-1/2  rounded-3xl transition duration-300 ease-in-out transform '
  }
  const handleAction = (mode, key) => {
    axios
      .post('/v1/bid-action', {
        mode,
        id: data.bids[key].id,
        content_id: data.bids[key].id,
        address__1: data.bids[key].address,
        address_2: currentAccount
      })
      .then((res) => {})
      .catch((err) => {
        console.log(err)
      })
  }

  const handleSubmit = () => {
    axios
      .post('/v1/save-nft-settings', { ...data, id: router.query.id })
      .then((res) => {
        toast('Saved')
      })
      .catch((err) => {
        console.log(err)
      })
  }

  const handleNFTtransfer = async (key) => {
    console.log(data, props)
    await enableWeb3()
    const transaction = await Moralis.transfer({
      type: 'erc721',
      contractAddress: contractAddress,
      tokenId: props[0].tokenId,
      receiver: data.bids[key].address
    })
    const response = transaction.wait(1)
    console.log(response)
    axios
      .post('/v1/nft/transfer', {
        id: data.bids[key].id,
        content_id: data.bids[key].content_id,
        address: data[key].address
      })
      .catch((err) => {
        console.log(err)
      })
  }
  return (
    <div className='flex flex-1 flex-col p-2'>
      <ToastContainer />
      <div className='flex flex-row justify-between p-4 shadow-md'>
        <label className='text-3xl text-black'>Bid</label>
        <Switch
          checked={data.post_sharing}
          className=' rounded-3xl '
          onChange={() =>
            setData((prevstate) => ({
              ...prevstate,
              bid: !data.bid
            }))
          }
        >
          <span className='block h-10 w-20 rounded-3xl bg-white p-2 shadow '>
            <span
              className={styles.toggle + (data?.bid ? styles.on : styles.off)}
            ></span>
          </span>
        </Switch>
      </div>

      <div className='my-5 flex flex-col'>
        <label className='text-2xl'>Bid starting from</label>

        <input
          disabled={!data?.bid ? true : false}
          className='mt-2 border-2 p-2 text-2xl  shadow-sm'
          name='start'
          onChange={(e) => {
            setData((prevstate) => ({
              ...prevstate,
              price: e.target.value
            }))
          }}
        />
        <label className='m-2 w-64 rounded-full bg-green-500 p-4 text-2xl shadow-md'>
          {data.price * 1000} $
        </label>
      </div>
      <div className='m-2 flex flex-row justify-end'>
        <button
          onClick={handleSubmit}
          className='rounded-xl bg-slate-800 p-3  text-2xl text-white'
        >
          Submit
        </button>
      </div>
      <div className='h-40 rounded-xl shadow-sm'>
        {data.bids.map((value, key) => (
          <div className='m-2 flex flex-row justify-between'>
            <div className='flex flex-col'>
              <label className='text-black '>{value.address}</label>
            </div>
            <div className='flex flex-col'>
              <label className='text-black '>{value.price} eth</label>
            </div>
            {value.status > 0 ? (
              <div className='flex w-1/4 flex-row justify-center'>
                {value.status == 1 ? (
                  <label className='rounded-md bg-green-600 p-3 text-2xl  text-white'>
                    Accepted
                  </label>
                ) : (
                  <button
                    onClick={() => handleNFTtransfer(key)}
                    className='rounded-md bg-green-600 p-3 text-2xl  text-white'
                  >
                    Transfer
                  </button>
                )}
              </div>
            ) : (
              <div className='flex w-1/4 flex-row justify-between'>
                <button
                  onClick={() => handleAction(1, key)}
                  className='mx-2 rounded-md bg-green-600 p-3  text-2xl text-white'
                >
                  Accept
                </button>
                <button
                  onClick={() => handleAction(2, key)}
                  className='mx-2 rounded-md bg-red-500 p-3 text-2xl text-white'
                >
                  Reject
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
export default NFT
