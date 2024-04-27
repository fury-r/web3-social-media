import '../styles/globals.css'
import Layout from '../components/Layout'
import '../styles/global.scss'
import { AuthProvider } from '../context/authContext'
import { MoralisProvider } from 'react-moralis'
import { Audio } from 'react-loader-spinner'
import 'react-toastify/dist/ReactToastify.css'
import './../styles/animation/register.css'
import './../styles/animation/login.css'

function MyApp({ Component, pageProps }) {
  return (
    <MoralisProvider
      serverUrl='https://vzlzq4xc9wod.usemoralis.com:2053/server'
      appId='gPyWd3By3iBEMPPnYD1GdLbjVtA5F3lbndeHNw17'
    >
      <AuthProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </AuthProvider>
    </MoralisProvider>
  )
}

export default MyApp
