import axios from '../../../api/axios'
import Posts from '../../../components/Posts'
import { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../../context/authContext'
import { Oval } from 'react-loader-spinner'

const Home = () => {
  const [data, setData] = useState([])
  const { connectWallet, currentAccount } = useContext(AuthContext)
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    getContent()
    // if(currentAccount.length==0){
    //   connectWallet()

    // }
  }, [])
  const getContent = async () => {
    await setLoading(true)
    await axios
      .get('/v1/get-content')
      .then((res) => {
        console.log(res.data)
        setData(res.data)
      })
      .catch((er) => {
        console.log(er)
      })
    setLoading(false)
  }

  return (
    <div className='h-screen'>
      <div className='m-3 flex flex-row justify-between '></div>

      {loading ? (
        <div className='flex flex-1 flex-col justify-center items-center min-h-screen'>
          <Oval
            height={50}
            width={50}
            color='black'
            wrapperStyle={{}}
            wrapperClass=''
            visible={true}
            ariaLabel='oval-loading'
            secondaryColor='black'
            strokeWidth={4}
            strokeWidthSecondary={4}
          />
        </div>
      ) : (
        <div className='m-4 flex flex-col justify-center items-center'>
          <Posts
            setData={setData}
            data={data}
            handleChange={getContent}
            mode={0}
          />
        </div>
      )}
    </div>
  )
}

export default Home
