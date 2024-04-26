import React, { useEffect, useState, Fragment, useRef } from 'react'
import { useRouter } from 'next/router'
import axios from '../../../../api/axios'
import { Dialog, Transition } from '@headlessui/react'
import toast, { Toaster } from 'react-hot-toast'
import AccountAction from '../../../../components/AccountActions'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faList } from '@fortawesome/free-solid-svg-icons'
import Messages from './messages'
import { BiSend } from 'react-icons/bi'
const Conversation = () => {
  const router = useRouter()
  const [show, setshow] = useState(false)
  const [data, setData] = useState({
    data: []
  })
  const [id, setId] = useState(0)
  const [text, setText] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const textfield = useRef()
  useEffect(() => {
    console.log(router.query)
    getConversation()
  }, [])

  const getConversation = () => {
    axios
      .get('/v1/get-message?id=' + router.query.id)
      .then((res) => setData(res.data))
      .catch((err) => {
        console.log(err)
      })
  }
  const handlesendMessage = async (e) => {
    e.preventDefault()
    await axios
      .post('/v1/send-message', {
        id: router.query.id,
        msg: text
      })
      .then((res) => {
        if (res.data?.message) {
          toast.error(res.data.message)
        }
        console.log(res.data)
        setText('')
      })
      .catch((err) => {
        console.log(err)
      })
    getConversation()
  }
  const styles = {
    1: 'bg-blue-300 float-right   mx-4 my-2 p-2 rounded-lg clearfix text-right text-xl break-words',
    2: 'bg-gray-300 mx-4 my-2 p-2 rounded-lg text-left',
    3: 'items-end',
    4: 'items-start'
  }

  const handleUnsendMessage = () => {
    axios
      .get('/v1/unsend-message?id=' + id)
      .then((res) => {
        setIsOpen(false)
        getConversation()
      })
      .catch((er) => {
        console.log(er?.reponse?.data)
      })
  }
  return (
    <div className='flex flex-col  justify-between   '>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as='div'
          className='relative z-10'
          onClose={() => setIsOpen(false)}
        >
          <Transition.Child
            as={Fragment}
            enter='ease-out duration-300'
            enterFrom='opacity-0'
            enterTo='opacity-100'
            leave='ease-in duration-200'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'
          >
            <div className='fixed inset-0 h-screen bg-black bg-opacity-25' />
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
                <Dialog.Panel className='w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all'>
                  <Dialog.Title
                    as='h3'
                    className='text-lg font-medium leading-6 text-gray-900'
                  >
                    Unsend Message
                  </Dialog.Title>

                  <div className='mt-4 flex flex-row justify-around'>
                    <button onClick={() => handleUnsendMessage()}>Yes</button>
                    <button onClick={() => setIsOpen(false)}>No</button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
      <div class=' flex  flex-1 flex-col  '>
        <Toaster />
        <AccountAction
          showMenu={show}
          setShowMenu={setshow}
          reload={getConversation}
          data={data}
        />

        <div className=' '>
          <div className='fixed w-1/2 '>
            <div className='flex flex-row items-center  justify-between p-3 shadow-md bg-white'>
              <label className='text-xl text-black'>{data?.username}</label>
              <button onClick={() => setshow(true)} className='text-3xl'>
                <FontAwesomeIcon icon={faList} />
              </button>
            </div>
          </div>
          <Messages
            data={data}
            styles={styles}
            setId={setId}
            setIsOpen={setIsOpen}
          />
          <div className=' p-5 h-5/6  bg-white '>
            <form className=' mb-2 fixed bottom-32 w-2/3 flex flex-row items-center '>
              <textarea
                class=' h-20 w-3/4  text-3xl resize-none items-center rounded-xl text-left border border-gray-300 bg-gray-200 py-2 px-4  pt-10 shadow-md'
                rows='1'
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder='Message...'
                onKeyPress={(e) => {
                  if (e.key == 'Space') {
                  }
                }}
              />
              <button
                className='mx-3 flex text-2xl justify-center items-center bg-black text-white p-5 rounded-lg shadow-lg'
                onClick={handlesendMessage}
              >
                Send <BiSend className='text-5xlxl' />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
export default Conversation
