import React, { useEffect, useState } from 'react'
import axios from '../../../api/axios'
import { Switch } from '@headlessui/react'
import toast, { Toaster } from 'react-hot-toast'

const Privacy = () => {
  const [data, setData] = useState({
    account_sharing: false,
    profile_spy: false,
    post_sharing: false,
    open: false,
    search_visibility: false
  })

  useEffect(() => {
    privacySettings()
  }, [])

  const privacySettings = () => {
    axios
      .get('/v1/get-privacy-settings')
      .then((res) => {
        setData(res.data)
      })
      .catch((err) => {
        console.log(err)
      })
  }

  const savePrivacySettings = () => {
    axios
      .post('/v1/save-privacy-settings', data)
      .then((res) => {
        toast.success('Settings Saved')
      })
      .catch((err) => {
        console.log(err)
      })
  }

  const handleToggle = (n) => {
    if (n == 1) {
      setData((prevstate) => ({
        ...prevstate,
        account_sharing: !data.account_sharing
      }))
    } else if (n == 2) {
      setData((prevstate) => ({
        ...prevstate,
        post_sharing: !data.post_sharing
      }))
    } else if (n == 3) {
      setData((prevstate) => ({
        ...prevstate,
        profile_spy: !data.profile_spy
      }))
    } else if (n == 4) {
      setData((prevstate) => ({
        ...prevstate,
        search_visibility: !data.search_visibility
      }))
    } else if (n == 5) {
      setData((prevstate) => ({
        ...prevstate,
        profile_spy: !data.open,
        post_sharing: !data.open,
        account_sharing: !data.open,
        open: !data.open
      }))
    }
  }

  const styles = {
    textStyle: 'font-medium text-xl',
    row: ' flex flex-row justify-between shadow-sm my-2 p-3',
    on: 'bg-gray-500 translate-x-full',
    off: 'bg-gray-300',
    toggle:
      'block h-full w-1/2  rounded-3xl transition duration-300 ease-in-out transform ',
    button: 'text-2xl bg-slate-700 p-4 text-white rounded-xl shadow-md '
  }

  return (
    <div className='p-5 flex flex-col'>
      <div className='flex flex-row justify-center mb-5'>
        <label className='text-2xl font-semibold'>Privacy settings</label>
      </div>
      <Toaster />

      <div className='flex flex-col '>
        <div className={styles.row}>
          <label className={styles.textStyle}>Account Sharing</label>
          <div className='flex flex-row '>
            <Switch
              checked={data.account_sharing}
              className=' rounded-3xl '
              onChange={() => handleToggle(1)}
            >
              <span className='block bg-white rounded-3xl shadow p-2 h-10 w-20 '>
                <span
                  className={
                    styles.toggle +
                    (data.account_sharing ? styles.on : styles.off)
                  }
                ></span>
              </span>
            </Switch>
          </div>
        </div>

        <div className={styles.row}>
          <label className={styles.textStyle}>Post Sharing</label>
          <div className='flex flex-row '>
            <Switch
              checked={data.post_sharing}
              className=' rounded-3xl '
              onChange={() => handleToggle(2)}
            >
              <span className='block bg-white rounded-3xl shadow p-2 h-10 w-20 flex'>
                <span
                  className={
                    styles.toggle + (data.post_sharing ? styles.on : styles.off)
                  }
                ></span>
              </span>
            </Switch>
          </div>
        </div>

        <div className={styles.row}>
          <label className={styles.textStyle}>Spy Checker</label>
          <div className='flex flex-row '>
            <Switch
              checked={data.profile_spy}
              className=' rounded-3xl '
              onChange={() => handleToggle(3)}
            >
              <span className='block bg-white rounded-3xl shadow p-2 h-10 w-20 flex'>
                <span
                  className={
                    styles.toggle + (data.profile_spy ? styles.on : styles.off)
                  }
                ></span>
              </span>
            </Switch>
          </div>
        </div>

        <div className={styles.row}>
          <label className={styles.textStyle}>Search Visibility</label>
          <div className='flex flex-row '>
            <Switch
              checked={data.search_visibility}
              className=' rounded-3xl '
              onChange={() => handleToggle(4)}
            >
              <span className='block bg-white rounded-3xl shadow p-2 h-10 w-20 flex'>
                <span
                  className={
                    styles.toggle +
                    (data.search_visibility ? styles.on : styles.off)
                  }
                ></span>
              </span>
            </Switch>
          </div>
        </div>

        <div className={styles.row}>
          <label className={styles.textStyle}>Public Account</label>
          <div className='flex flex-row '>
            <Switch
              checked={data.open}
              className=' rounded-3xl '
              onChange={() => handleToggle(5)}
            >
              <span className='block bg-white rounded-3xl shadow p-2 h-10 w-20 flex'>
                <span
                  className={
                    styles.toggle + (data.open ? styles.on : styles.off)
                  }
                ></span>
              </span>
            </Switch>
          </div>
        </div>
      </div>
      <div className='flex flex-row justify-end mt-5'>
        <button onClick={savePrivacySettings} className={styles.button}>
          Save Settings
        </button>
      </div>
    </div>
  )
}

export default Privacy
