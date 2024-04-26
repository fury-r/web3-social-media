import Router from 'next/router'
import React, { createContext, useEffect, useState } from 'react'
import { useMoralis } from 'react-moralis'
import axios from '../api/axios'

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [currentAccount, setCurrentAccount] = useState('')
  const [formattedAccount, setFormattedAccount] = useState('')
  const [props, setProps] = useState('')
  const { isAuthenticated, authenticate, user, logout, Moralis, enableWeb3 } =
    useMoralis()
  useEffect(() => {
    if (isAuthenticated) {
      console.log(user)
      const account = user.get('ethAddress')
      let formatAccount = account.slice(0, 4)
      account.slice(-4)
      setFormattedAccount(formatAccount)
      setCurrentAccount(account)
      console.log(account)
    }
  }, [isAuthenticated, enableWeb3])

  useEffect(() => {
    if (!currentAccount) return
    ;async () => {
      const response = await fetch('/api/createUser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: {
          walletAddress: currentAccount
        }
      })
      const data = await response.json()
    }
  }, [currentAccount])

  const connectWallet = async () => {
    await authenticate()
  }
  const signOut = () => {
    logout()
  }
  let values = {
    connectWallet,
    signOut,
    isAuthenticated,
    formattedAccount,
    currentAccount,
    props,
    setProps,
    enableWeb3
  }
  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>
}
