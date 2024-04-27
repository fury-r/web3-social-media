import React, { useContext, useState } from 'react'

import { faCircle } from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Router from 'next/router'
import { Form } from 'react-bootstrap'
import toast, { Toaster } from 'react-hot-toast'
import axios from '../../api/axios'
import { AuthContext } from '../../context/authContext'

const Registeration = () => {
  const [open, setOpen] = useState(false)
  const [errors, setErrors] = useState({
    username: [],
    password: [],
    email: []
  })

  const {
    connectWallet,
    currentAccount,
    isAuthenticated,
    format,
    formattedAccount
  } = useContext(AuthContext)

  const signUpWithMeta = () => {
    connectWallet()
  }

  const signUpwithGoogle = (e) => {
    console.log(e)
    // axios
    // .post("/v1/sign-in-with-google")
    // .then((res)=>{

    // }).catch((err)=>{

    // })
  }

  const submit = (e) => {
    e.preventDefault()

    const { name, username, email, password } = e.target.elements

    axios
      .post('/v1/register', {
        email: email.value,
        name: name.value,
        username: username.value,
        password: password.value,
        open: open,
        wallet: currentAccount ? true : false,
        address: currentAccount
      })
      .then((res) => {
        toast.success('Account Created Successfully')
        Router.push({
          pathname: '../otpview/otpview',
          query: { email: email.value }
        })
      })
      .catch((e) => {
        console.log(e.response.data)
        setErrors((prevstate) => ({ ...prevstate, ...e.response.data }))
      })
  }

  const styles = {
    input:
      '  text-lg rounded-lg shadow-sm p-3 py-4 text-2xl focus:border-purple-500 border-black border-1',
    headers: 'text-xl font-bold',
    errors: 'font-bold text-red-500',
    button:
      ' shadow-sm rounded-lg px-5 py-3 text-xl  text-white font-bold hover:opacity-80 w-100'
  }

  return (
    <div className='area slider-thumb  flex h-screen w-screen flex-col items-center  justify-center '>
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
      <div className='sm:1/2 z-50 mt-10 rounded-3xl bg-white p-5 shadow-md md:w-1/2 lg:w-1/4'>
        <Form className='flex flex-col pt-3  md:pt-8  ' onSubmit={submit}>
          <Form.Label className=' flex flex-row justify-center text-3xl font-bold'>
            Register
          </Form.Label>
          <div>
            <Form.Group className='mb-3' controlId='formBasicEmail'>
              <Form.Label className={styles.headers}>Email address</Form.Label>
              <Form.Control
                name='email'
                type='email'
                placeholder='Mobile Number or Email'
                className={styles.input}
              />
              <div>
                {errors.email.map((v) => (
                  <Form.Text className={styles.errors}>
                    {errors.username}
                  </Form.Text>
                ))}
              </div>{' '}
            </Form.Group>

            <Form.Group className='mb-3 ' controlId='formBasicName'>
              <Form.Label className={styles.headers}>Full Name</Form.Label>
              <Form.Control
                name='name'
                type='text'
                placeholder='Full Name'
                className={styles.input}
              />
              <Form.Text className='text-muted'></Form.Text>
            </Form.Group>

            <Form.Group className='mb-3' controlId='formBasicUsername'>
              <Form.Label className={styles.headers}>Username</Form.Label>
              <Form.Control
                name='username'
                type='text'
                placeholder='Username'
                className={styles.input}
              />
              <div>
                {errors.username.map((v) => (
                  <Form.Text className={styles.errors}>{v}</Form.Text>
                ))}
              </div>{' '}
            </Form.Group>
            <Form.Group className='mb-3' controlId='formBasicPassword'>
              <Form.Label className={styles.headers}>Password</Form.Label>
              <Form.Control
                name='password'
                type='password'
                placeholder='Password'
                className={styles.input}
              />
              <div className='flex flex-col'>
                {errors.password.map((v, key) => (
                  <Form.Text key={key} className={styles.errors}>
                    {v}
                  </Form.Text>
                ))}
              </div>
            </Form.Group>

            <Form.Group className='mb-3 flex flex-row items-center'>
              <label className='text-2xl'>
                {!isAuthenticated ? 'Wallet Not Connected' : 'Wallet Connected'}
              </label>
              <FontAwesomeIcon
                className={
                  'rounded-full m-3 ' +
                  (isAuthenticated
                    ? 'bg-green-500 text-green-500'
                    : 'bg-gray-500 text-gray-500')
                }
                icon={faCircle}
              />
            </Form.Group>

            <Form.Group className='mb-3 flex flex-row justify-center text-2xl items-center'>
              <Form.Switch
                className=''
                onChange={(e) => {
                  setOpen(!open)
                }}
              />
              <label className='ml-3'>Private Account</label>
            </Form.Group>
          </div>
          <div className='flex flex-row justify-center '>
            <button
              onClick={() => {
                //   Router.push('/home/home')
              }}
              type='submit'
              className={'  bg-green-500  ' + styles.button}
            >
              Register
            </button>
          </div>
          <div className='mt-5 flex flex-row items-center justify-between'>
            <div className=' flex flex-row justify-center'>
              <button
                onClick={signUpWithMeta}
                className={'  bg-orange-600  ' + styles.button}
              >
                Connect Wallet
              </button>
            </div>
            {/* <Form.Group className="d-flex  justify-center">
              <GoogleLogin
                clientId="1063770433514-udf8b16r8vtoidvon6o1s9523p36rt2e.apps.googleusercontent.com"
                buttonText="Sign up"
                onSuccess={(e) => {
                  console.log(e)
                }}
                onFailure={() => toast('Failed')}
              />
              ,
            </Form.Group> */}
            <Form.Group className='d-flex  justify-center'>
              <button
                className={' bg-blue-500  ' + styles.button}
                onClick={() => Router.push('/')}
              >
                Login
              </button>
            </Form.Group>
          </div>
        </Form>{' '}
      </div>
      <div className='wave -one'></div>
      <div className='wave -two'></div>
      <div className='wave -three'></div>
    </div>
  )
}
export default Registeration
