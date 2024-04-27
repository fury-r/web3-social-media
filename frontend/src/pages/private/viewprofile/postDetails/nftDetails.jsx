import React, { useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { AuthContext } from '../../../../context/authContext'
import ViewPosts from '../../../../components/ViewPost'
import axios from '../../../../api/axios'

const PostDetails = () => {
  const { props, currentAccount, enableWeb3, authenticate } =
    useContext(AuthContext)

  const router = useRouter()
  const [data, setData] = useState([])
  const [bids, setBids] = useState([])
  useEffect(() => {
    setData(props)
    console.log(data, 'printing data in nftDetail', props)
    handlegetBids()
  }, [])
  const handlegetBids = () => {
    console.log(props[0], '---------------------------')
    axios
      .get('/v1/get-bids/' + props[0].id)
      .then((res) => {
        setBids(res.data)
      })
      .catch((err) => {
        console.log(err)
      })
  }

  return (
    <div className='flex flex-col items-center '>
      <ViewPosts
        data={props}
        mode={2}
        bids={bids}
        scroll={router.query.key}
        handlegetBids={handlegetBids}
      />
    </div>
  )
}
export default PostDetails
