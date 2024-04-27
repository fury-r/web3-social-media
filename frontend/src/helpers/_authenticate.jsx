// eslint-disable-next-line
import axios from '../api/axios'
import { useRouter } from 'next/router'
import React from 'react'
export function authenticateRoute(Component) {
  const Router = useRouter()
  return function authenticateRoute(props) {
    axios
      .get('/authenticate')
      .then((res) => {
        return <Component />
      })
      .catch((err) => {
        Router.replace('/login/login')
        return <h1>Loading...</h1>
      })
  }
}
