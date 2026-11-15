import { io } from 'socket.io-client'

// One connection to the chat server (server.js), shared by the whole app
export const socket = io('http://localhost:3001')
