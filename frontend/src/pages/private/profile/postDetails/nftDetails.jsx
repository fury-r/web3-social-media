import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../../../context/authContext'

import Posts from '../../../../components/Posts'
const PostDetails = () => {
  const { props } = useContext(AuthContext)

  const [data, setData] = useState({})

  useEffect(() => {
    setData(props)
    console.log(props)
  }, [])

  return (
    <div className='flex min-h-screen flex-col items-center '>
      <Posts data={props} mode={2} />
      <div className='m-2 flex h-1/2 flex-col p-3 '>
        <label className='text-center text-2xl text-black'>NFT Details</label>
        <div className='flex flex-row justify-between'>
          <div className='flex flex-col'></div>

          <div className='flex flex-col'></div>
        </div>
      </div>
    </div>
  )
}
export default PostDetails
