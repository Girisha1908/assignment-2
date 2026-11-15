import { io } from 'socket.io-client'

// One connection to the chat server (server.js), shared by the whole app.
// VITE_SOCKET_URL is set by the frontend host for production deployments.
const socketUrl = import.meta.env.VITE_SOCKET_URL || `http://${window.location.hostname}:3001`

export const socket = io(socketUrl)
