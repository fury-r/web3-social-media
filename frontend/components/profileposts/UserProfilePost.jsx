import React, { useState, useRef, Fragment, useEffect, useContext } from 'react'
import Image from 'next/image'
import axios from '../../api/axios'
import { AuthContext } from '../../context/authContext'

import Moralis from 'moralis'

const UserPosts = ({ access, id, mode, handleViewPost, address, setCount }) => {
  const [posts, setPosts] = useState([])
  const [nftsUrl, setnftsUrl] = useState({})

  const { props, setProps, currentAccount, enableWeb } = useContext(AuthContext)
  useEffect(() => {
    getUserPosts()
  }, [mode])
  const getUserPosts = () => {
    axios
      .post('/v1/profile-posts/' + mode, {
        id: id
      })
      .then((res) => {
        console.log(res.data)
        setPosts(res.data)
        setProps(res.data)
        setCount(res.data.length)
        if (mode == 2) {
          fetchNFTS(res.data)
        }
      })
      .catch((err) => console.log(err.response.data))
  }

  const fetchNFTS = async (values) => {
    const options = { chain: 'rinkeby', address: address }

    const nfts = await Moralis.Web3.getNFTs(options)
    const selected = values.map((x) => x.tokenId)
    console.log(nfts)
    mapAndSet(nfts, selected)
  }
  const mapAndSet = (nfts, selected) => {
    nfts.map(async (x) => {
      if (selected.indexOf(x.token_id) != -1) {
        const response = await (await fetch(x.token_uri)).json()
        console.log(response)
        setnftsUrl({
          ...nftsUrl,
          [x.token_id]: response.image
        })
      }
    })
    console.log(nftsUrl, selected)
  }
  return (
    <div className='-mx-px flex w-full  flex-col'>
      {access && posts.length > 0 ? (
        <div className='grid grid-cols-3 '>
          {posts.map((v, k) => (
            <button
              className={`border-1   border-black  `}
              key={k}
              onClick={() => {
                handleViewPost(k, mode)
              }}
            >
              <article className='post relative bg-gray-100 text-white   '>
                <Image
                  src={`data:image/${v.type};base64,${v.img}`}
                  className='absolute left-0 top-0   object-contain hover:opacity-50'
                  width={100}
                  height={150}
                  objectFit='fit'
                />
                <i className='fas fa-square absolute right-0 top-0 m-1'></i>
                <div
                  className='overlay absolute left-0 top-0 hidden h-full 
                          w-full bg-blue-800 bg-opacity-25 '
                ></div>
              </article>
            </button>
          ))}
        </div>
      ) : (
        <div className='flexflex-col justify-center items-center'>
          <h1 className='text-center text-3xl text-gray-600 font-bold'>
            {' '}
            Feed is empty
          </h1>
        </div>
      )}
    </div>
  )
}
export default UserPosts
