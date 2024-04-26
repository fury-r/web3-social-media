import React, { useEffect, useState } from 'react'
import { Button } from 'react-bootstrap'
import axios from '../../../../api/axios'

import socket from '../../../../api/socket'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser } from '@fortawesome/free-regular-svg-icons'
import Image from 'next/image'

const Requests = () => {
  const [requests, setRequests] = useState([])
  useEffect(() => {
    getData()
  }, [])

  const getData = () => {
    axios
      .get('/v1/get-requests')
      .then((res) => {
        console.log(res.data)
        setRequests(res.data)
      })
      .catch((err) => {
        console.log(err)
      })
    console.log(requests)
  }
  const requestResponse = (id, action) => {
    axios
      .post('/v1/requests-response', {
        _id: id,
        action: action
      })
      .then((res) => {
        console.log(res.data)
        setRequests(res.data)
      })
      .catch((err) => {
        console.log(err)
      })
    console.log(requests)
  }
  return (
    <div className='flex-1'>
      <ul className='m-5'>
        {requests.length > 0 ? (
          requests.map((value, key) => (
            <div
              key={key}
              className='flex flex-row justify-between  shadow-sm  p-2'
            >
              <div className='flex flex-row justify-between '>
                <div className='mx-5 bg-gray-500 rounded-full'>
                  {value?.profile_picture ? (
                    <Image
                      src={`data:image/${value.type};base64,${value.image}`}
                      alt='myimage'
                      width={50}
                      height={50}
                      className='rounded-full'
                    />
                  ) : (
                    <FontAwesomeIcon
                      color='black'
                      icon={faUser}
                      className='text-2xl  text-white rounded-full p-2'
                    />
                  )}
                </div>
                <label>{value.username}</label>
              </div>
              <label> {value.time}</label>

              <div className='flex flex-row justify-between '>
                <Button
                  onClick={() => {
                    requestResponse(value.id, 1)
                  }}
                  className='bg-green-500 mx-2'
                >
                  Accept
                </Button>
                <Button
                  onClick={() => {
                    requestResponse(value.id, 0)
                  }}
                  className='bg-red-300'
                >
                  Reject
                </Button>
              </div>
            </div>
          ))
        ) : (
          <></>
        )}
      </ul>
    </div>
  )
}
export default Requests
