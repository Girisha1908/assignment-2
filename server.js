// Chat server: Express + socket.io
// Every browser connects to this server. When one browser sends a message,
// the server adds a random user and the time, then sends it to ALL browsers.

import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import { getRandomUser } from './src/users.js'

const PORT = 3001

const app = express()
const httpServer = createServer(app)

// Allow the React app (running on a different port) to connect
const io = new Server(httpServer, {
  cors: { origin: '*' },
})

app.get('/', (req, res) => {
  res.send('Chat server is running')
})

let nextId = 1

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id)

  // A browser published a message on the "send-message" channel
  socket.on('send-message', (text) => {
    const message = {
      id: nextId,
      user: getRandomUser(),
      text: text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
    }
    nextId = nextId + 1

    // Send it to everyone subscribed to "new-message" (including the sender)
    io.emit('new-message', message)
  })

  socket.on('disconnect', () => {
    console.log('A user disconnected:', socket.id)
  })
})

httpServer.listen(PORT, () => {
  console.log(`Chat server running on http://localhost:${PORT}`)
})
