import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Image from 'next/image'
import {
  faComment,
  faHeart,
  faImage,
  faUser
} from '@fortawesome/free-regular-svg-icons'
import Router from 'next/router'
import { Dialog, Transition } from '@headlessui/react'
import { AuthContext } from '../context/authContext'
import { useMoralisWeb3Api } from 'react-moralis'

import {
  faList,
  faPlus,
  faUserFriends
} from '@fortawesome/free-solid-svg-icons'
import AccountAction from './AccountActions'
import React, { useState, useRef, Fragment, useEffect, useContext } from 'react'

const ViewProfileComponent = ({
  data,
  handlePost,
  mode,
  handleFollowUser,
  reload,
  user,
  setMode
}) => {
  console.log(mode, 'mode')
  //const {currentAccount,authenticate} = useContext(AuthContext)

  return <></>
}
export default ViewProfileComponent
