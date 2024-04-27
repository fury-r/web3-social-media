import React, { useEffect, useRef } from 'react'

const Messages = ({ styles, data, message, setId, setIsOpen }) => {
  const scroll = useRef()

  useEffect(() => {
    console.log(scroll)
    if (scroll?.current) {
      scroll?.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [scroll?.current, data])
  return (
    <>
      {data.data.length > 0 ? (
        <div className=' m-5 flex  flex-col  h-4/6 max-h-screen overflow-y-auto my-20'>
          {data.data.map((value, key) => (
            <button
              key={key}
              ref={key == data.data.length - 1 ? scroll : null}
              className={styles[value.user + 2] + ' flex flex-col'}
              onClick={() => {
                if (value.user == 1) {
                  console.log(data)
                  setId(data.data[key].id)
                  setIsOpen(true)
                }
              }}
            >
              <div
                class={
                  styles[value.user] +
                  ' my-4 p-4 text-xl shadow-md ' +
                  (value.msg.length > 32 ? ' w-1/2' : '')
                }
              >
                {value.msg}
              </div>
              {value.seen == true &&
              value.user == 1 &&
              key == data.length - 1 ? (
                <label className='flex rounded-sm p-2 text-2xl shadow-sm'>
                  seen
                </label>
              ) : (
                <></>
              )}
            </button>
          ))}
        </div>
      ) : (
        <div className=' flex flex-col justify-center items-center text-3xl h-screen '>
          Start a conversation
        </div>
      )}
    </>
  )
}
export default Messages
