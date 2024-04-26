import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import { Button, Form } from 'react-bootstrap'
import axios from '../../api/axios'
import styles from '../../styles/styles'
import toast, { Toaster } from 'react-hot-toast'
const OtpView = () => {
  const Router = useRouter()
  useEffect(() => {
    console.log(Router.query)
  }, [])

  const validateOtp = (e) => {
    e.preventDefault()
    const { pin } = e.target.elements
    axios
      .post('/v1/validate-otp', {
        otp: pin.value,
        email: Router.query.email
      })
      .then((res) => {
        toast.success('OTP Validated Successfully')
        localStorage.setItem('token', res.data.token)
        Router.push('/private/home/home')
      })
      .catch((e) => {
        console.log(e)
        toast.error(e.response.data.message)
      })
  }

  return (
    <div className='area  flex flex-col h-full items-center justify-center  bg-grey-lighter min-h-screen   bg-gray-100 '>
      <Toaster />
      <div className=''>
        <ul className='circles'>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
        </ul>
      </div>
      <Form
        onSubmit={validateOtp}
        className='flex  bg-white flex-col items-center content-center w-2/3 z-50 justify-center shadow-md p-10 rounded-3xl '
      >
        <Form.Label className='text-4xl'>Otp has been sent to</Form.Label>
        <b className='text-4xl'> {Router.query.email}</b>

        <input
          style={{ borderColor: 'black', borderWidth: 1 }}
          maxLength={5}
          type='text'
          name='pin'
          className={styles.otp}
        />

        <div className='flex flex-row justify-center'>
          <Button
            onClick={() => {
              //   Router.push('/home/home')
            }}
            className='bg-green-400 hover:bg-green-600 text-white font-bold py-2 px-4 border-transparent hover:border-transparent text-3xl w-56 h-16  rounded-md'
            type='submit'
          >
            Submit
          </Button>
        </div>
      </Form>
    </div>
  )
}
export default OtpView
