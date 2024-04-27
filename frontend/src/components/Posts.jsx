import Router from 'next/router'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Dialog, Transition } from '@headlessui/react'

import {
  faComment,
  faHeart,
  faMessage,
  faUser
} from '@fortawesome/free-regular-svg-icons'
import { Button } from 'react-bootstrap'
import Image from 'next/image'
import axios from '../api/axios'
import React, { useEffect, useState, Fragment, useContext } from 'react'
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons'
import Moralis from 'moralis'
import { contractABI, contractAddress } from '../contracts/contracts'
import Web3, { window } from 'web3'
import { AuthContext } from '../context/authContext'
import CountUp from 'react-countup'
import toast, { Toaster } from 'react-hot-toast'

const web3 = new Web3(Web3.givenProvider)

const Posts = ({ data, handleChange, mode, setData }) => {
  const [show, setshow] = useState(false)
  const { currentAccount } = useContext(AuthContext)
  const [id, setId] = useState(0)
  const [bids, setBids] = useState([])

  useEffect(() => {
    console.log(mode, data)
    if (mode == 2) {
      handlegetBids()
    }
  }, [])

  const handlegetBids = () => {
    axios
      .get('/v1/get-bids/' + data[0].id)
      .then((res) => {
        setBids(res.data)
      })
      .catch((err) => {
        console.log(err)
      })
  }

  const handleLike = (index) => {
    console.log(index)
    axios
      .post('/v1/like-post', {
        id: data[index].id
      })
      .then((res) => {
        data[index].liked = true
        setData(data)
      })
      .catch((er) => {
        console.log(er)
      })
    handleChange()
  }

  const styles = {
    button: ' my-4 text-3xl'
  }

  const handleDelete = () => {
    axios
      .get('/v1/delete-post?id=' + data[id].id)
      .then((res) => {
        data.splice(key, 1)
        setData(data)
        toast.success('Post Deleted Successfully')
      })
      .catch((err) => {
        console.log(err)
      })
  }

  const handleMint = async () => {
    await Moralis.enableWeb3()
    //await Moralis.authenticate()
    let e = data[id]
    axios
      .get('/v1/validate-post?id=' + e.id)
      .then(async (res) => {
        try {
          const metadata = {
            name: e.name,
            description: e.desc,
            image: e['img']
          }
          // const web3 = new Web3(window.ethereum);
          const metadataFile = new Moralis.File(
            `${metadata.name}metadata.json`,
            { base64: Buffer.from(JSON.stringify(metadata)).toString('base64') }
          )
          console.log(metadataFile, 'sdsdds')
          await metadataFile.saveIPFS()
          const metadataURI = metadataFile.ipfs({ useMasterKey: true })

          const txt = await mintToken(metadataURI, e.id)
        } catch (err) {
          console.log(err)
        }
      })
      .catch((err) => {
        console.log(err.response?.data)
      })
  }

  const mintToken = async (uri, id) => {
    try {
      const contract = new web3.eth.Contract(contractABI, contractAddress, {
        gas: 0,
        gasPrice: 0
      })
      const response = await contract.methods
        .mint(uri)
        .send({ from: currentAccount })
      console.log(response)
      const tokenId = response.events.Transfer.returnValues.tokenId
      axios
        .post('/v1/mint-post', {
          tokenId: response.events.Transfer.returnValues.tokenId,
          id: id,
          transactionHash: response.transactionHash
        })
        .then((res) => {})
        .catch((er) => {
          toast.success('NFT is minted at address ' + currentAccount)
        })
    } catch (err) {
      console.log(err)
    }
  }

  const handleEdit = () => {
    Router.push('/private/editpost/' + data[id].id)
  }

  return (
    <>
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
                      onClick={handleDelete}
                      className={'text-red-500 ' + styles.button}
                    >
                      Delete Post
                    </button>
                    <button
                      onClick={handleEdit}
                      className={'text-gray-500 ' + styles.button}
                    >
                      Edit Post
                    </button>
                    {data[id]?.mint ? (
                      <button
                        onClick={() => {
                          console.log(data[id])
                          Router.push('/private/nft/' + data[id].id)
                        }}
                        className={'text-gray-500 ' + styles.button}
                      >
                        NFT Settings
                      </button>
                    ) : (
                      <button
                        onClick={handleMint}
                        className={'text-gray-500 ' + styles.button}
                      >
                        Mint Post
                      </button>
                    )}
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
            className='sm:w-70 my-3 rounded-2xl bg-white shadow-md  sm:w-2/3  md:w-2/3 lg:w-1/2'
          >
            <div className='flex flex-row items-center justify-between  bg-slate-100 p-3'>
              <FontAwesomeIcon className='text-4xl' icon={faUser} />
              <label className='text-bold text-2xl'>{value.username}</label>
            </div>
            <Toaster />
            {mode > 0 && mode < 3 ? (
              <div className='m-2 flex flex-row justify-end'>
                <Button
                  className='border-0 hover:bg-transparent hover:opacity-40'
                  onClick={() => {
                    setId(key)
                    console.log(data)
                    setshow(true)
                  }}
                >
                  <FontAwesomeIcon
                    size='lg'
                    className='h-12  w-20 border-0 text-gray-400  outline-none hover:opacity-40 '
                    icon={faEllipsisV}
                  />
                </Button>
              </div>
            ) : (
              <></>
            )}

            <div className='p-4'>
              <div className='flex flex-row justify-center  '>
                <Image
                  src={`data:image/${value.type};base64,${value.img}`}
                  alt='myimage'
                  width={value.dim.width / 3}
                  height={value.dim.height / 3}
                />
              </div>
              <span className='border-1 inline-block w-full border-black bg-black  text-black'></span>
              <div className='border-t-1 mt-4 flex flex-row justify-around border-t-black py-2'>
                <button onClick={() => handleLike(data.indexOf(value))}>
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
              <div className='w-1/3'>
                <label className='break-words text-2xl'>{value.desc}</label>
              </div>
              <div className='mt-5 flex flex-row'>
                <div id='likes' className='mr-10'>
                  <labels className='text-2xl'>
                    <CountUp end={value.likes} />{' '}
                    {value.likes == 1 ? 'like' : 'likes'}
                  </labels>
                </div>
                <div>
                  <labels className='text-2xl'>
                    <CountUp end={value.comments} /> comments{' '}
                  </labels>
                </div>
              </div>
            </div>
          </div>
        ))
      ) : (
        <></>
      )}
      {mode == 2 ? (
        <div className='flex flex-col '>
          <div className='flex flex-row justify-center'>
            <label className='text-2xl text-white'>Offers</label>
          </div>

          <div className='flex cursor-all-scroll flex-row rounded-lg p-2 shadow-sm '>
            {bids.length > 0 ? (
              bids.map((value, key) => (
                <div className='flex flex-row justify-between p-2'>
                  <label className='text-xl text-black'>{value.address}</label>
                  <label className='text-xl text-black'>
                    {value.price} eth
                  </label>
                </div>
              ))
            ) : (
              <></>
              // <label className="text-black"> Be the first one to bid</label>
            )}
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  )
}
export default Posts
