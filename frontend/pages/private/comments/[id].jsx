import React, { useEffect, useState } from 'react'
import axios from '../../../api/axios'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart } from '@fortawesome/free-regular-svg-icons'

import { useRouter } from 'next/router'
import { faArrowRight } from '@fortawesome/free-solid-svg-icons'
import toast, { Toaster } from 'react-hot-toast'

const Comments = () => {
  const [data, setData] = useState([])
  const router = useRouter()

  useEffect(() => {
    handleGetComments()
  }, [])

  const handleGetComments = () => {
    console.log(router)
    axios
      .get('/v1/get-comments?id=' + router.query.id)
      .then((res) => {
        console.log(res.da)
        setData(res.data)
      })
      .catch((err) => {
        console.log(err)
      })
  }

  const handlePostcomment = (e) => {
    e.preventDefault()
    const { comment } = e.target.elements

    axios
      .post('/v1/post-comment', {
        comment: comment.value,
        content_id: router.query.id
      })
      .then((res) => {
        //if (res.data?.message){
        //  toast.error(res.data.message)
        //  }
      })
      .catch((err) => {})
    handleGetComments()
  }

  const handleLikeComment = (key) => {
    axios
      .post('/v1/like-comment', {
        id: data[key].id
      })
      .catch((err) => {
        console.log(err)
      })
    handleGetComments()
  }
  return (
    <>
      <div className='flex flex-col justify-between p-2  '>
        <Toaster />
        <div className='flex flex-1 flex-col '>
          {data.length > 0 ? (
            data.map((value, key) => (
              <div
                key={key}
                className='shadow-sm flex flex-row justify-between p-4'
              >
                <div>
                  <label className='text-3xl mx-2 font-bold'>
                    {value.username}
                  </label>
                  <label className='text-2xl ms-4 '>{value.comment}</label>
                </div>
                <div className='flex flex-row justify-start my-1'>
                  <button onClick={() => handleLikeComment(key)}>
                    <FontAwesomeIcon
                      icon={faHeart}
                      className={
                        (value.liked ? 'text-red-500' : 'text-gray-400') +
                        ' text-2xl'
                      }
                    />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className='flex flex-1 flex-row justify-center items-center'>
              <label className='text-3xl'>No Comments Found</label>
            </div>
          )}
        </div>
        <form
          onSubmit={handlePostcomment}
          className='flex rounded-full  flex-row justify-between border-1 m-5 drop-shadow-md items-center'
        >
          <input
            name='comment'
            type='text'
            required
            className='p-2 px-4 text-2xl  shadow-md rounded-full  m-2 h-20 drop-shadow-sm w-full'
          />
          <button
            className='p-2 bg-slate-600 rounded-full   text-white hover:opacity-50 h-20 w-32 text-3xl font-bol'
            type='submit'
          >
            <FontAwesomeIcon icon={faArrowRight} />
          </button>
        </form>
      </div>
    </>
  )
}
export default Comments
