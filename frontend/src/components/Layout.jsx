import Router, { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import styles from '../styles/styles'
import BottomNavigation from './BottomNavigation'
import Navbar from './Navbar'
import Login from '../pages/login/login'
import axios from '../api/axios'
import Registeration from '../pages/registeration/registeration'
import OtpView from '../pages/otpview/otpview'
import ForgotPassword from '../pages/forgotpassword/forgotpassword'
import { useAuth } from '../context/authContext'

const Layout = ({ children }) => {
  const router = useRouter()
  const { }=useAuth()
  const [showHeader, setshowheader] = useState(
    !router.pathname.includes('/private') ? false : true
  )
  const [auth, setAuth] = useState(true)
  useEffect(() => {
    axios
      .get('/v1/authenticate')
      .then((res) => {
        console.log(res)
        setAuth(true)

        setshowheader(true)
      })
      .catch((e) => {
        console.log(e)
        setAuth(false)
        setshowheader(false)
      })
      let interval;
      if(localStorage.getItem('token')){
        interval= setInterval(() => {
          handleOnline()
        }, 15000)
      }
      return()=>{
        if(interval){
          clearInterval(interval)
        }
      }
  },[])



  const handleOnline = () => {
    if (auth) {
      axios
        .get('/v1/online')
        .then((res) => {})
        .catch((err) => {
          console.log(err)
        })
    }
  }

  const isDiary = router.pathname.includes('/diary')
  const isPrivate = auth && router.pathname.includes('/private') ? true : false
  return (
    <div
      style={{ ...styles.body, backgroundColor: 'white' }}
      className='flex-row '
    >
      {showHeader && router.pathname.includes('/private') ? <Navbar /> : <></>}
      <div className={isPrivate ? 'py-24 flex flex-col items-center ' : ''}>
        <div className={isPrivate && !isDiary ? 'md:w-1/2 w-full' : 'w-full'}>
          {router.pathname.includes('/private') && auth ? (
            children
          ) : router.pathname.includes('/registeration') ? (
            <>
              <Registeration />
            </>
          ) : router.pathname.includes('/otpview') ? (
            <OtpView />
          ) : router.pathname.includes('/forgotpassword') ? (
            <>
              <ForgotPassword />
            </>
          ) : (
            <>
              <Login />
            </>
          )}
        </div>
      </div>
      {showHeader && router.pathname.includes('/private') ? (
        <div>
          <BottomNavigation />
        </div>
      ) : (
        <></>
      )}
    </div>
  )
}
export default Layout
