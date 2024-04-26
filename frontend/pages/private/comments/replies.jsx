import { useEffect, useState } from 'react'
import axiosInstance from '../../../api/axios'

const Replies = ({ id, selected, id }) => {
  const [show, setshow] = useState(false)
  useEffect(() => {
    getCommentsReply()
  }, [show == true])
  const [data, setData] = useState([])
  const replyComment = (e) => {}
  const getCommentsReply = (e) => {
    axios
      .get('/v1/get-comments-reply/' + id)
      .then((res) => {
        setData(res.data)
      })
      .catch((err) => {
        console.log(err.response.data)
      })
  }

  return (
    <div className='flex flex-col '>
      <div className='flex flex-row items-center justify-start'>
        <button onClick={() => setshow(!show)}>
          {show ? 'Hide replies' : 'View replies'}
        </button>
        <button onClick={() => setSelected(id)}>Replies</button>
      </div>
      {show && data.length > 0 ? (
        data.map((value, key) => (
          <div className='m-3 ml-4 flex-row justify-between'></div>
        ))
      ) : (
        <></>
      )}
    </div>
  )
}
