import React, { Fragment, useEffect, useRef, useState } from 'react'
import axios from '../../../api/axios'
import Image from 'next/image'
import { FileUploader } from 'react-drag-drop-files'
import { Dialog, Transition } from '@headlessui/react'
import toast, { Toaster } from 'react-hot-toast'

const Post = () => {
  const [image, setImage] = useState({
    name: ''
  })
  const [imageurl, setImageUrl] = useState('')
  const [show, setshow] = useState(false)
  const [showModal, setshowModal] = useState(false)

  const [parts, setParts] = useState([])
  const [desc, setDesc] = useState('')
  const inputFile = useRef(1)
  const extensions = ['JPG', 'PNG']
  const handleFileUpload = (e) => {
    e.preventDefault()
    if (image?.name.length > 0) {
      console.log(image, typeof image)
      const formData = new FormData()
      formData.append(
        'image',

        image
      )
      formData.append('type', parts[1])
      formData.append('name', parts[0])
      formData.append('desc', desc)
      console.log(formData.get('image'), '--------------', image)
      axios
        .post('/v1/upload-file', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
        .then((res) => {
          toast.success('Photo has been posted')
        })
        .catch((err) => {
          console.log(err)
        })
    } else {
      toast.error('Please select a photo')
    }
  }

  useEffect(() => {
    //inputFile.current.click()
  }, [])

  const handleFileLoad = (e) => {
    const files = e
    console.log(files)

    if (files && files.size) {
      const filename = files.name
      const fileReader = new FileReader()
      fileReader.readAsDataURL(files)
      var parts = filename.split('.')
      setParts(parts)
      const fileType = parts[parts.length - 1]
      console.log('fileType', fileType) //ex: zip, rar, jpg, svg etc.
      fileReader.onload = function () {
        console.log(fileReader.result)
        setImageUrl(fileReader.result)
        setImage(files)
        setshow(true)
      }
    }
  }

  return (
    <div className='  flex flex-col  justify-center   max-h-screen'>
      <Toaster />
      <Transition appear show={showModal} as={Fragment}>
        <Dialog
          as='div'
          className='relative z-10'
          onClose={() => setshowModal(false)}
        >
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
                <Dialog.Panel className='w-full max-h-full transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all'>
                  <div className='flex flex-row justify-center '>
                    <FileUploader
                      handleChange={handleFileLoad}
                      name='file'
                      types={extensions}
                    />
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
      <form
        onSubmit={handleFileUpload}
        enctype='multipart/form-data'
        className='flex  flex-col justify-center '
      >
        {!show ? (
          <input
            style={{ display: 'none' }}
            ref={inputFile}
            onChange={handleFileLoad}
            type='file'
            accept='image/*'
          />
        ) : (
          <div className=' flex flex-row justify-center my-3 items-center'>
            <Image
              src={imageurl}
              className='border-10  '
              height={300}
              width={300}
            />
          </div>
        )}
        <div class=' mx-5 p-5 shadow-md rounded-3xl bg-white'>
          <label
            class='block uppercase tracking-wide text-gray-700 font-bold mb-2 text-lg'
            for='grid-password'
          >
            Description
          </label>
          <textarea
            onChange={(e) => {
              setDesc(e.target.value)
            }}
            rows='10'
            class='appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500 text-2xl'
          ></textarea>
          <div className='flex flex-row justify-center mt-5'>
            <button
              type='submit'
              className='mx-2 bg-blue-500 text-white text-2xl p-3 rounded-md shadow-md hover:opacity-50'
            >
              Upload{' '}
            </button>
            <button
              onClick={() => setshowModal(true)}
              className='mx-2 bg-blue-500 text-white text-2xl p-3 rounded-md shadow-md hover:opacity-50'
            >
              Choose{' '}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
export default Post
