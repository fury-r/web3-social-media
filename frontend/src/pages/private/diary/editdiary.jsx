import React, { useEffect, useState } from 'react'
import axios from '../../../api/axios'
import toast, { Toaster } from 'react-hot-toast'
import Router from 'next/router'
import TextDisplay from './TextDisplay'
import DisplayPopUp from '../../../components/PopUp'

const EditDiary = () => {
  const [data, setData] = useState([])
  const [text, setText] = useState('')
  const [value, setValue] = useState({
    date: '',
    text: ''
  })
  const [showEntryBox, setShowEntryBox] = useState(false)
  const [timer, setTimer] = useState(150000)
  useEffect(() => {
    getDiary()
  }, [])

  const getDiary = () => {
    axios
      .get('/v1/view-diary?mode=' + 1)
      .then((res) => {
        if (res.data.diary) {
          setData(res.data.diary)
        }
        setValue(res.data)
        console.log(value, '-------------------------')
      })
      .catch((err) => {
        console.log(err)
      })
  }

  const handleChange = () => {
    axios
      .post('/v1/edit-diary', {
        text: text,
        date: value.date
      })
      .then((res) => {})
      .catch((err) => {
        console.log(err)
      })
    toast.success('Changes uploaded')
    Router.push('/private/diary/viewdiary')
  }
  const save = async () => {
    await handleChange()
    Router.push('/private/diary/viewdiary')
  }

  const textBoxComp = () => {
    return (
      <div className='m-3 rounded-md flex flex-col  items-center'>
        <textarea
          value={text}
          onChange={(e) => {
            setText(e.target.value)
          }}
          className='w-full p-4 h-72 text-2xl border-2 border-black shadow-md rounded-2xl focus:outline-indigo-700'
          row={5}
          column={50}
        />

        <button
          onClick={save}
          className='bg-blue-500 mt-4 p-3 w-1/5 rounded-lg hover:bg-green-500  shadow-sm'
        >
          <label className='text-white text-3xl'>Save</label>
        </button>
      </div>
    )
  }

  return (
    <div className='flex flex-1 h-screen flex-col p-2 items-center space-y-10'>
      <Toaster />
      <div className='flex flex-col items-center w-1/2'>
        <div className='p-5 shadow-lg rounded-lg flex-wrap w-full '>
          {TextDisplay(value.text, value.date)}
        </div>
      </div>

      <button
        onClick={() => {
          setShowEntryBox(true)
        }}
        className='bg-blue-500 py-5 w-80 rounded-lg hover:bg-green-500 shadow-sm'
      >
        <label className='text-white text-3xl'>Add Entry</label>
      </button>
      {DisplayPopUp(textBoxComp, 'w-1/2', showEntryBox, setShowEntryBox)}
    </div>
  )
}
export default EditDiary
