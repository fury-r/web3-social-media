import React, { useEffect, useState } from 'react'
import axios from '../../../api/axios'
import { Dialog, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import { AiOutlineFileAdd } from 'react-icons/ai'
import Router from 'next/router'
import TexTDisplay from './TextDisplay'
import DisplayPopUp from '../../../components/PopUp'
import FormatDate from './formatDate'

const ViewDiary = () => {
  const [data, setData] = useState([])
  const [show, setshow] = useState(false)
  const [selected, setSelected] = useState('')
  const [selectedDate, setSelectedDate] = useState('')
  useEffect(() => {
    getDiary()
  }, [])

  const getDiary = () => {
    axios
      .get('/v1/view-diary?mode=' + 0)
      .then((res) => {
        console.log(res.data)
        setData(res.data)
      })
      .catch((err) => {
        console.log(err)
      })
  }

  const handleViewMore = (key) => {
    setSelectedDate(data[key].date)
    setSelected(data[key].text)
    setshow(true)
  }

  return (
    <>
      <DisplayPopUp
        content={TexTDisplay(selected, selectedDate)}
        style={
          'w-1/2 h-[600px] transform rounded-3xl bg-white px-8 py-10 text-left shadow-xl transition-all overflow-y-auto'
        }
        show={show}
        callHook={setshow}
      />

      <div className='flex flex-1 flex-col p-2 min-h-screen'>
        {data.length > 0 ? (
          <div className='grid grid-cols-3 gap-2'>
            {data.map((value, key) => (
              <div
                key={key}
                className='m-4 flex flex-col justify-between rounded-[60px] bg-stone-900 px-3 p-10 shadow-2xl'
              >
                <div className='text-base text-white'>
                  <div className='justify-left flex flex-row pl-10 pt-10'>
                    <label className='whitespace-pre-line text-7xl font-semibold'>
                      {' '}
                      {FormatDate(value.date).replaceAll(' ', '\n')}
                    </label>
                  </div>
                  <p className='my-2 px-10 pt-5 text-xl'>
                    Last Entry:{' '}
                    {value.last_entry.substring(
                      0,
                      Math.min(30, value.text.length)
                    ) + (value.text.length > 30 ? '....' : '')}
                  </p>
                </div>
                <button
                  onClick={() => handleViewMore(key)}
                  className='ml-10 mt-10 w-1/2 rounded-2xl py-3 px-5 text-2xl text-white outline outline-2 transition-colors hover:bg-white hover:text-black'
                >
                  View more
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className='flex flex-row justify-center items-center '>
            <label className='text-4xl'>No diary Found</label>
          </div>
        )}
        <button
          onClick={() => {
            Router.push('/private/diary/editdiary')
          }}
          className='rounded-full p-5 bg-green-600 w-32 h-32 shadow-md flex justify-center items-center fixed bottom-20 right-20 '
        >
          <AiOutlineFileAdd className='text-5xl text-white ' />
        </button>
      </div>
    </>
  )
}
export default ViewDiary
