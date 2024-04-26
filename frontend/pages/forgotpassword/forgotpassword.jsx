import Router from 'next/router'
import React, { useState } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import axios from '../../api/axios'

const ForgotPassword = () => {
  const [email, setEmail] = useState('')
  const [show, setShow] = useState(false)
  const [error, setError] = useState('')
  const [password, setPassword] = useState({
    password: '',
    confirmPassword: ''
  })
  const [otp, setOtp] = useState('')

  const handleSendOtp = () => {
    setError('')
    if (email.length === 0) {
      setError('Please enter email')
    } else {
      axios
        .post('/v1/forgot-password', { email })
        .then((res) => {
          setShow(true)
          toast.success('OTP has been sent to your email ' + email)
        })
        .catch((err) => {
          console.log(err)
          toast.error(err.response.data.data)
        })
    }
  }

  const handleChangePassword = () => {
    setError('')

    axios
      .post('/v1/change-password', { email, otp, password: password.password })
      .then((res) => {
        toast.success('Password changed successfully')
        Router.push('/login')
      })
      .catch((err) => {
        console.log(err.response.data)
        setError(err.response.data.data)
      })
  }

  const styles = {
    input:
      'p-2 rounded-lg text-2xl  border-2 w-1/2 border-gray-700 my-3 text-center focus:outline-none',
    button: 'w-1/3 rounded-xl p-4 text-2xl m-4 bg-gray-700 text-white'
  }

  return (
    <div className='flex flex-1 flex-col items-center justify-center p-5 bg-red-400 min-h-screen'>
      <Toaster />
      <div className='flex flex-col p-5 items-center justify-center shadow-lg rounded-lg w-1/2 bg-white h-1/2'>
        {!show ? (
          <>
            <input
              placeholder='Email'
              type='email'
              className={styles.input}
              required
              onChange={(e) => setEmail(e.target.value)}
            />
            <label className='text-lg font-bold text-red-500'>{error}</label>
            <button className={styles.button} onClick={handleSendOtp}>
              Send OTP
            </button>
          </>
        ) : (
          <>
            <input
              placeholder='Enter Otp'
              type='number'
              maxLength={6}
              minLength={6}
              required
              className={styles.input}
              onChange={(e) => setOtp(e.target.value)}
            />
            <input
              placeholder='Enter Password'
              type='password'
              required
              className={styles.input}
              value={password.password}
              onChange={(e) =>
                setPassword((prevstate) => ({
                  ...prevstate,
                  password: e.target.value
                }))
              }
            />

            <input
              placeholder='Re-enter Password'
              type='password'
              required
              className={styles.input}
              value={password.confirmPassword}
              onChange={(e) =>
                setPassword((prevstate) => ({
                  ...prevstate,
                  confirmPassword: e.target.value
                }))
              }
            />

            <label className='text-md font-bold text-red-500'>
              {password.password != password.confirmPassword
                ? 'Both passwords are different'
                : ''}
            </label>
            <label className='text-md font-bold text-red-500'>{error}</label>
            <button onClick={handleChangePassword} className={styles.button}>
              Submit
            </button>
          </>
        )}
      </div>
    </div>
  )
}
export default ForgotPassword
