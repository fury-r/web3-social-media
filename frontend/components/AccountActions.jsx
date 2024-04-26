import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useState } from 'react'
import axios from '../api/axios'

const AccountAction = ({
  visible,
  data,
  showMenu,
  setShowMenu,
  reload,
  mode
}) => {
  const [confirm, setConfirm] = useState(false)
  const [action, setAction] = useState(-1)
  const handleMenuAction = () => {
    if (action == 1 || action == 2) {
      axios
        .post('/v1/account-action', {
          action,
          username: data.username
        })
        .then((res) => {
          reload()
        })
        .catch((err) => {
          console.log(err)
        })
      reload(mode)

      setConfirm(false)
      setShowMenu(false)
    }
  }
  const text = {
    1: "Note:By blocking this user this user can't see your photos,account and the user cant like & comment on your posts ,and message you",
    2: "Note:By restricting this user this user can see your photos and account , the user can like but  can't comment on your posts and message you"
  }

  const styles = {
    actionStyle: 'shadow-sm text-2xl p-5 hover:opacity-25 font-semibold  ',
    red: 'text-red-500'
  }
  return (
    <>
      <Transition appear show={showMenu} as={Fragment}>
        <Dialog
          as='div'
          className='relative z-10'
          onClose={() => setShowMenu(false)}
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
                <Dialog.Panel className='w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all'>
                  <div className='flex flex-col justify-around'>
                    <button
                      onClick={() => {
                        setAction(1)
                        setShowMenu(false)
                        setConfirm(true)
                      }}
                      className={
                        styles.actionStyle + (data.blocked ? styles.red : '')
                      }
                    >
                      {data.blocked ? 'Unblock' : 'Block'}
                    </button>
                    <button
                      className={
                        styles.actionStyle + (data.restricted ? styles.red : '')
                      }
                      onClick={() => {
                        setAction(2)

                        setShowMenu(false)
                        setConfirm(true)
                      }}
                    >
                      {data.restricted ? 'Unrestrict' : 'Restrict'}
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      <Transition appear show={confirm} as={Fragment}>
        <Dialog
          as='div'
          className='relative z-10 w-full'
          onClose={() => setShowMenu(false)}
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
            <div className='fixed inset-0 bg-black bg-opacity-25' />
          </Transition.Child>

          <div className='fixed inset-0 overflow-y-auto w-full'>
            <div className='flex min-h-full items-center justify-center p-4 text-center w-full'>
              <Transition.Child
                as={Fragment}
                enter='ease-out duration-300'
                enterFrom='opacity-0 scale-95'
                enterTo='opacity-100 scale-100'
                leave='ease-in duration-200'
                leaveFrom='opacity-100 scale-100'
                leaveTo='opacity-0 scale-95'
              >
                <Dialog.Panel className='w-1/2 transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all'>
                  <div className='flex flex-col justify-center'>
                    <div>
                      <label className='m-3 text-2xl text-red-500 font-medium'>
                        {text[action]}
                      </label>
                    </div>
                    <div className='flex flex-row justify-evenly mt-4'>
                      <button
                        className='p-3 bg-gray-800 w-1/2 text-white mx-3 rounded-md font-bold text-2xl '
                        onClick={handleMenuAction}
                      >
                        Yes
                      </button>
                      <button
                        className='p-3 bg-gray-800 w-1/2 text-white mx-3 rounded-md font-bold text-2xl'
                        onClick={() => setConfirm(false)}
                      >
                        No
                      </button>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}
export default AccountAction
