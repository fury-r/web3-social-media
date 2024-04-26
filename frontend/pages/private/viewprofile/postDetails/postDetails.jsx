import React, { useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { AuthContext } from '../../../../context/authContext'
import ViewPosts from '../../../../components/ViewPost'
import axiosInstance from '../../../../api/axios'

const PostDetails = () => {
  const { props } = useContext(AuthContext)

  const router = useRouter()
  const [data, setData] = useState([])
  const [mode, setMode] = useState(router.query.mode)
  let user = router.query.id
  useEffect(() => {
    getProfile()
  }, [])
  const getProfile = () => {
    axiosInstance
      .post('/v1/get-user-profile', {
        user,
        mode: 1
      })
      .then((res) => {
        setData(res.data)
      })
      .catch((err) => console.log(err.response.data))
  }

  return (
    <div className='flex flex-col items-center '>
      <ViewPosts
        set={setMode}
        handleChange={getProfile}
        data={props}
        scroll={router.query.key}
        setData={setData}
        mode={mode}
      />
    </div>
  )
}
export default PostDetails
