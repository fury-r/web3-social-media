import React, { Fragment, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import axios from '../../../api/axios'

const EditUserProfile = ({ show, setshow, data, toast, reload, setData }) => {
  const [errors, setErrors] = useState({
    desc: '',
    username: ''
  })
  let username = data?.username ? data.username : ''

  var charLimit = 100
  var [charCount, setCharCount] = useState(charLimit)

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log(username, data.username)

    setErrors({
      desc: '',
      username: ''
    })

    axios
      .post('/v1/update-profile', {
        username: data.username,
        desc: data.desc
      })
      .then((res) => {
        if (res.data?.message) {
          toast.error(res.data?.messsage)
        } else {
          toast.success('Profile has been updated')
        }
        reload()
        setshow(false)
      })
      .catch((err) => {
        if (err.response?.data) {
          let error = err.response.data
          let keys = Object.keys(errors)
          keys.forEach((key, index) => {
            setErrors((prevState) => ({
              ...prevState,
              [key]: error[key]
            }))
          })
          setData((prevState) => ({
            ...prevState,
            username: username
          }))
        }
        console.log(err.response, errors, ';-------------------------------')
        console.log(reload)
        reload()
      })
  }

  const styles = {
    row: 'flex flex-col my-10',
    errors: 'text-red-500 text-xl',
    input: 'p-2 text-2xl rounded-lg shadow-md'
  }

  return (
    <Transition appear show={show} as={Fragment}>
      <Dialog as='div' className='relative z-10' onClose={() => setshow(false)}>
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
              <Dialog.Panel className='w-full max-w-md h-96 transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all'>
                <div className='flex flex-col justify-around'>
                  <form onSubmit={handleSubmit}>
                    <div className={styles.row}>
                      <input
                        onChange={(e) => {
                          setData((prevstate) => ({
                            ...prevstate,
                            username: e.target.value
                          }))
                        }}
                        className={styles.input}
                        value={data.username}
                        type='text'
                        name='username'
                        required
                      />
                      <label className={styles.errors}>{errors.username}</label>
                    </div>
                    <div className={styles.row}>
                      <p>Charcters Left:{charCount}</p>
                      <textarea
                        maxLength={charLimit}
                        onClick={(e) => {
                          setCharCount(charLimit - e.target.value.length)
                        }}
                        onChange={(e) => {
                          setCharCount(charLimit - e.target.value.length)
                          setData((prevstate) => ({
                            ...prevstate,
                            desc: e.target.value
                          }))
                        }}
                        className={styles.input}
                        rows={2}
                        col={4}
                        value={data.desc}
                        type='text'
                        name='desc'
                        required
                      />
                      <label className={styles.errors}>{errors.desc}</label>
                    </div>
                    <button
                      type='submit'
                      className='p-3 text-2xl text-white rounded-md bg-gray-700'
                    >
                      {' '}
                      Update Profile
                    </button>
                  </form>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}

export default EditUserProfile
