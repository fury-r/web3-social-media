// eslint-disable-next-line

import io from 'socket.io-client'
const url = 'http://127.0.0.1:8080'

const socket = io(url)
export default socket
