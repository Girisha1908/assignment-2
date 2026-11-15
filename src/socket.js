import { io } from 'socket.io-client'

// One connection to the chat server (server.js), shared by the whole app.
// Use the same computer the page came from, so it also works from a phone or another PC.
export const socket = io(`http://${window.location.hostname}:3001`)
