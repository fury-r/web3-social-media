// eslint-disable-next-line

import axios from 'axios'

// eslint-disable-next-line no-undef
const url = typeof window !== 'undefined' ? process.env.BASE_URL : null
const axiosInstance = axios.create({
  baseURL: url || 'http://127.0.0.1:8080'
})
axiosInstance.interceptors.request.use(async (config) => {
  if (['post', 'get', 'put', 'delete'].includes(config.method)) {
    try {
      let token =
        typeof window !== 'undefined' ? localStorage.getItem('token') : null

      config.headers['Authorization'] = `Bearer ${token}`
      config.headers['Access-Control-Allow-Origin'] = '*'
    } catch (e) {
      console.error(e)
    }
    return config
  }
})
export default axiosInstance
