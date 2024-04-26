import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Router, { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import {
  faAddressCard,
  faPlusSquare,
  faUser
} from '@fortawesome/free-regular-svg-icons'
import { faHome, faSearch } from '@fortawesome/free-solid-svg-icons'

const BottomNavigation = (props) => {
  const styles = {
    button:
      ' text-black  hover:border-transparent  hover:bg-white hover:text-black ',
    active:
      ' rounded-full bg-gradient-to-r from-gray-500   to-black p-2 shadow-lime-50  text-white transform transition-all -translate-y-10 rounded-t-full  ',
    tabs: ' border-transparent hover:border-transparent  font-mono bg-transparent items-center  hover:bg-white   ',
    dimIcons: 'h-14 md:h-10 sm:h-10 w-20 md:w-20 sm:10'
  }
  const route = useRouter()
  const [active, setActive] = useState(route.pathname)

  useEffect(() => {
    setActive(route.pathname)
  }, [route])
  return (
    <div className='fixed bottom-0 w-full  '>
      <div className='0 my-2 mx-10 flex flex-row items-center justify-around rounded-3xl bg-white py-3 shadow-lg'>
        <button
          onClick={() => {
            Router.push('/private/home/home')
          }}
          className={
            styles.tabs +
            (active.includes('home/') ? styles.active : styles.button)
          }
        >
          <FontAwesomeIcon className={styles.dimIcons} icon={faHome} />
        </button>
        <button
          onClick={() => {
            Router.push('/private/explore/explore')
          }}
          className={
            styles.tabs +
            (active.includes('explore/') ? styles.active : styles.button)
          }
        >
          <FontAwesomeIcon className={styles.dimIcons} icon={faSearch} />
        </button>
        <button
          onClick={() => {
            Router.push('/private/Post/Post')
          }}
          className={
            styles.tabs +
            (active.includes('Post/') ? styles.active : styles.button)
          }
        >
          <FontAwesomeIcon className={styles.dimIcons} icon={faPlusSquare} />
        </button>
        <button
          onClick={() => {
            Router.push('/private/activity/acitivity')
          }}
          className={
            styles.tabs +
            (active.includes('activity/') ? styles.active : styles.button)
          }
        >
          <FontAwesomeIcon className={styles.dimIcons} icon={faAddressCard} />
        </button>
        <button
          className={
            styles.tabs +
            (active.includes('profile/profile') ? styles.active : styles.button)
          }
          onClick={() => {
            Router.push('/private/profile/profile')
          }}
        >
          <FontAwesomeIcon className={styles.dimIcons} icon={faUser} />{' '}
        </button>
      </div>
    </div>
  )
}
export default BottomNavigation
