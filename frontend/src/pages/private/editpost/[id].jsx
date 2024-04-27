import React, { useEffect, useState } from 'react'
import axios from '../../../api/axios'
import { useRouter } from 'next/router'
import Image from 'next/image'
import toast, { Toaster } from 'react-hot-toast'

const EditPost = () => {
  const styles = {
    button:
      'p-4 text-xl hover:opacity-40 bg-cyan-500 shadow-sm rounded-md text-white '
  }
  const router = useRouter()
  const [data, setData] = useState({})
  const [desc, setDesc] = useState('')
  useEffect(() => {
    getPostDetails()
  }, [])

  const getPostDetails = () => {
    console.log(router)
    axios
      .get('/v1/get-post?id=' + router.query.id)
      .then((res) => {
        setData(res.data)
        setData(res.data.desc)
      })
      .catch((err) => {
        console.log(err)
      })
  }

  const handleSubmit = () => {
    axios
      .post('/v1/edit-post', {
        id: router.query.id,
        desc
      })
      .then((res) => {
        toast.success('Post Edited')
      })
      .catch((err) => {
        console.log(err)
      })
  }
  const handleDelete = () => {
    axios
      .post('/v1/delete-post?id=' + router.query.id)
      .then((res) => {
        toast('Post Deleted')
      })
      .catch((err) => {
        console.log(err)
      })
  }
  return (
    <div className='flex-1 flex-col m-5 '>
      <Toaster />
      <div className='flex-row justify-start'>
        <Image
          src={`data:image/${data.type};base64,${data.img}`}
          alt='myimage'
          width={320}
          height={120}
        />
      </div>
      <div className='flex-row'>
        <textarea
          value={desc}
          onChange={(e) => {
            setDesc(e.target.value)
          }}
          rows='10'
          class='appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200  py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500 shadow-xl rounded-xl'
        ></textarea>
      </div>
      <div className='flex flex-row justify-around'>
        <button onClick={handleSubmit} className={styles.button}>
          Submit{' '}
        </button>

        <button onClick={handleDelete} className={styles.button}>
          Delete Post
        </button>
      </div>
    </div>
  )
}
export default EditPost
