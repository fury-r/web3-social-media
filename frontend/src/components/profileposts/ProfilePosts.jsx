import { useContext, useEffect, useState } from 'react'
import axiosInstance from '../../api/axios'
import Image from 'next/image'
import {
  faComment,
  faEdit,
  faHeart,
  faUser
} from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Router from 'next/router'
import { AuthContext } from '../../context/authContext'
import Moralis from 'moralis'
import { Oval } from 'react-loader-spinner'
import { useMoralisWeb3Api } from 'react-moralis'
const ProfilePost = ({ mode, setCount }) => {
  const [data, setData] = useState([])
  //const [nftsUrl, setnftsUrl] = useState({})
  const Web3API = useMoralisWeb3Api()
  const { setProps, currentAccount, enableWeb3 } = useContext(AuthContext)
  const [loading, setLoading] = useState(false)
  const handleViewPost = (k) => {
    let prop = data[k]
    // prop.img=nftsUrl[prop.tokenId]
    //console.log(prop,nftsUrl[prop.tokenId],prop.tokenId,nftsUrl)
    setProps([prop])
    if (mode == 2) {
      Router.push({ pathname: '/private/profile/postDetails/nftDetails' })
    } else {
      Router.push({ pathname: '/private/profile/postDetails/postDetails' })
    }
  }
  useEffect(() => {
    getPosts()
  }, [mode])

  const getPosts = async () => {
    setData([])
    setLoading(true)
    await axiosInstance
      .post('/v1/profile-posts/' + mode)
      .then((res) => {
        setData(res.data)
        setCount(res.data.length)
        if (mode == 2) {
          // fetchNFTS(res.data)
        }
      })
      .catch((err) => {
        console.log(err)
      })
    setLoading(false)
  }

  // const fetchNFTS=async(values)=>{
  //  // const options={chain:'matic testnet',address:currentAccount}
  //  const options={chain:'rinkeby',address:currentAccount}
  //   const nfts=await (await Web3API.account.getNFTs(options)).result
  //   const selected=values.map(x=>x.tokenId)
  //   console.log(nfts)
  //   mapAndSet(nfts,selected,)
  // }
  // const mapAndSet=(nfts,selected)=>{
  //   nfts.map(async(x)=>{

  //     if(selected.indexOf(x.token_id)!=-1){
  //       const response=await (await fetch(x.token_uri)).json()
  //       console.log(response)
  //       setnftsUrl({
  //         ...nftsUrl,
  //         [x.token_id]:response.image
  //       })
  //     }
  //   })
  //   console.log(nftsUrl,selected)

  // }
  return (
    <div className='-mx-px flex w-full flex-col'>
      {loading ? (
        <div className='flex flex-1 flex-col justify-center items-center'>
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
        <div className='grid grid-cols-3 '>
          {data.map((v, k) => (
            <button
              className={`border-1  border-black flex  `}
              onClick={() => {
                handleViewPost(k)
              }}
            >
              <div className='post hoverpost relative text-white border-red-500 flex   '>
                <Image
                  src={`data:image/${v.type};base64,${v.img}`}
                  alt='image'
                  className='absolute left-0 top-0   object-contain hover:opacity-50'
                  width={140}
                  height={150}
                  objectFit='fit'
                />
                <i className='fas fa-square absolute right-0 top-0 m-1'></i>

                <div className='showreactions absolute right-40 border-2 border-sky-400'>
                  <span className='p-2 text-4xl '>
                    {v?.likes}
                    <FontAwesomeIcon icon={faHeart} />
                  </span>

                  <span className='p-2 text-4xl '>
                    {v?.comments}
                    <FontAwesomeIcon icon={faComment} className='text-white' />
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className='flex justify-center'>
          <label className='text-center text-2xl'>No Posts</label>
        </div>
      )}
    </div>
  )
}
export default ProfilePost
