import React, { useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { AuthContext } from '../../../../context/authContext'

import Posts from '../../../../components/Posts'
const PostDetails = () => {
  const { props } = useContext(AuthContext)

  const router = useRouter()
  const [data, setData] = useState([])

  useEffect(() => {
    setData(props)
  }, [])

  return (
    <div className='flex flex-col items-center '>
      <Posts data={data} setData={data} mode={1} />
    </div>
  )
}
export default PostDetails
