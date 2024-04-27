import React, { useContext, useEffect, useState } from 'react'
import { Form, Button } from 'react-bootstrap'
import '../../styles/styles'
import Router from 'next/router'
import axios from '../../api/axios'

import { AuthContext } from '../../context/authContext'
import toast, { Toaster } from 'react-hot-toast'

const Login = () => {
  //const router = useRouter()
  const [errors, setErrors] = useState({
    validate: ''
  })

  const { connectWallet, currentAccount, setIdentity } = useContext(AuthContext)

  useEffect(() => {
    axios
      .get('/v1/authenticate')
      .then((res) => {
        console.log(res)
        Router.push('/private/home/home')
      })
      .catch((e) => {})
    if (currentAccount.length > 0) {
      console.log('call')
      handleLoginWallet()
    }
    // let interval = setInterval(() => {
    //   if (socket.connected) {
    //     socket.on('connect_test', () => {})
    //   }
    // }, 1000)
    // socket.on('connect')
  }, [currentAccount])

  const submit = (e) => {
    e.preventDefault()
    console.log(e.target.elements)
    const { email, password } = e.target.elements

    axios
      .post('/v1/login', {
        email: email.value,
        password: password.value
      })
      .then((res) => {
        toast.success('Account Validated Successfully')
        Router.push({
          pathname: '/otpview/otpview',
          query: { email: res.data.email }
        })
      })
      .catch((e) => {
        console.log(e.response.data)
        toast.error(e.response.data.validate)
      })
  }

  const handleLoginWallet = () => {
    axios
      .post('/v1/login-wallet', {
        address: currentAccount
      })
      .then((res) => {
        localStorage.setItem('token', res.data.token)
        Router.push('/private/home/home')
      })
      .catch((err) => {
        console.log(err)
      })
  }

  // if(currentAccount.length>0){
  //   axios
  //   .post("/v1/login-wallet",{
  //     address:currentAccount
  //   })
  //   .then((res)=>{
  //     localStorage.setItem('token',res.data.token)
  //     Router.push('/private/home/home')
  //   }).catch((err)=>{
  //     console.log(err)
  //   })
  // }

  const handleLogin = async () => {
    await connectWallet()
  }
  const styles = {
    input:
      '  text-lg rounded-lg shadow-md p-3 py-4 text-2xl focus:border-purple-500 border-black border-1',
    button:
      ' w-1/2 shadow-sm rounded-lg px-5 py-3 text-xl  text-white font-bold hover:opacity-80 border-0'
  }
  return (
    <>
      <div className='font-family-karla flex h-screen bg-white '>
        <div className='flex w-full flex-wrap'>
          <div className=' flex w-full flex-col sm:w-1/2 md:w-1/2 lg:w-2/5'>
            <div className='flex justify-center pt-12 md:-mb-24 md:justify-start md:pl-12'>
              {/* <a href="#" className="bg-orange-400 p-3 text-xl font-bold text-white rounded-lg px-4 shadow-md">
                Leylines
              </a> */}

              <img src='logo.png' className='w-1/5'></img>
              <h1 className=' text-4xl font-bold mt-auto mb-auto'>LeyLines</h1>
            </div>
            <Toaster />
            <div className=' my-auto flex flex-col justify-center px-8 pt-8 md:justify-start md:px-24 md:pt-0 lg:px-32'>
              <div className='group mb-16 flex flex-row justify-center w-full mt-10 '>
                <h1 className='mb-1 font-mono text-2xl  text-black md:text-4xl '>
                  Welcome <br className=' hidden' />
                  <span className='text-brand-accent inline-flex h-20 animate-type overflow-x-hidden whitespace-nowrap pt-2 will-change-transform group-hover:animate-type-reverse'>
                    to Leylines.
                  </span>
                  <span className='ml-2 -mb-2 box-border inline-block h-10 w-1 animate-cursor bg-white will-change-transform md:-mb-4 md:h-16'></span>
                </h1>
              </div>{' '}
              <Form
                className='flex flex-col p-5 pt-3  md:pt-8'
                onSubmit={submit}
              >
                <label className=' 5  flex justify-center p-2 text-4xl font-bold'>
                  Login
                </label>
                <div>
                  <div
                    className='mb-8 mt-5 flex flex-col'
                    controlId='formBasicEmail'
                  >
                    <label className='text-xl font-bold'>Email address</label>

                    <input
                      type='email'
                      className={styles.input}
                      placeholder='Enter email'
                      name='email'
                    />
                  </div>

                  <div
                    className='mb-8 flex flex-col'
                    controlId='formBasicPassword'
                  >
                    <label className='text-xl font-bold'>Password</label>
                    <input
                      type='password'
                      placeholder='Password'
                      name='password'
                      className={styles.input}
                    />
                  </div>
                </div>
                {errors.validate ? (
                  <div className='mb-5 flex justify-center rounded-md bg-red-400 p-2'>
                    <label className='font-bold text-white'>
                      {errors.validate}
                    </label>
                  </div>
                ) : (
                  <></>
                )}
                <div className='mt-3 flex flex-row justify-center space-x-10'>
                  <Button
                    onClick={() => {
                      //   Router.push('/home/home')
                    }}
                    className={' bg-green-500 ' + styles.button}
                    type='submit'
                  >
                    Login
                  </Button>

                  <button
                    className={'  bg-gray-500 ' + styles.button}
                    onClick={handleLogin}
                  >
                    Connect Wallet
                  </button>
                </div>
                {/* <div className="d-flex mt-4 justify-center"></div>
                <div className="d-flex mt-4 justify-center"></div> */}
              </Form>
              <div>
                <button
                  onClick={() => Router.push('/forgotpassword/forgotpassword')}
                  className='text-xl font-bold m-3'
                >
                  Forgot Password?
                </button>
              </div>
              <div className='mt-10 flex flex-row  justify-center text-2xl'>
                Don't have an Account?
                <Button
                  className={'  ml-5 text-sky-400'}
                  onClick={() => Router.push('/registeration/registeration')}
                >
                  Register
                </Button>
              </div>
            </div>
          </div>

          <div className='flex-1 sliding-container w-full'>
            <div className='sliding-background'></div>
          </div>
        </div>
      </div>
    </>
  )
}
export default Login
