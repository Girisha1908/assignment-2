import { useState, useEffect, useRef, useSyncExternalStore } from 'react'
import Message from './Message.jsx'
import ChatInput from './ChatInput.jsx'
import { socket } from './socket.js'
import { getRandomUser } from './users.js'
import './App.css'

const starterMessages = [
  {
    id: 'welcome',
    user: 'PubNub Bot',
    time: '12:16',
    text: 'Welcome to Team Chat. 👋👋 Send a message now to start interacting with other users in the app. ⬇️',
    isOwn: false,
  },
]

function App() {
  const [messages, setMessages] = useState(starterMessages) // every message so far
  const bottomRef = useRef(null) // an empty div at the end of the list

  // true while connected to the chat server (server.js)
  const connected = useSyncExternalStore(
    (onChange) => {
      socket.on('connect', onChange)
      socket.on('disconnect', onChange)

      return () => {
        socket.off('connect', onChange)
        socket.off('disconnect', onChange)
      }
    },
    () => socket.connected,
    () => false,
  )

  // Subscribe to messages from the server when the app starts
  useEffect(() => {
    function handleNewMessage(message) {
      // Decide "mine or not" now: socket.id changes if the connection drops and comes back
      const isOwn = message.senderId === socket.id
      setMessages((oldMessages) => [...oldMessages, { ...message, isOwn }]) // add it to the end of the list
    }
    socket.on('new-message', handleNewMessage)

    // Unsubscribe when the app closes
    return () => {
      socket.off('new-message', handleNewMessage)
    }
  }, [])

  // Called by ChatInput when the user presses Send
  function sendMessage(text) {
    if (connected) {
      // Publish the text. The server adds the user and time, then sends it back to everyone.
      socket.emit('send-message', text)
      return
    }

    // Server offline: still show the message, just in this browser
    const message = {
      id: 'local-' + Date.now(),
      user: getRandomUser(),
      text: text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
      isOwn: true,
    }
    setMessages((oldMessages) => [...oldMessages, message])
  }

  // After a new message appears, scroll down so it is visible
  useEffect(() => {
    bottomRef.current.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return (
    <div className="chat">
      <header className="chat-header">
        <div>
          <h1>Introductions</h1>
          <p>This Channel Is For Company Wide Chatter</p>
        </div>
        <div className="header-right">
          <span className="message-count">3 | 100</span>
          <i className="fa-regular fa-user-group header-icon" aria-hidden="true"></i>
          <span className={connected ? 'status online' : 'status offline'}>
            {connected ? 'Connected' : 'Offline'}
          </span>
        </div>
      </header>

      <main className="messages">
        {messages.length === 0 && <p className="empty">No messages yet. Say hi 👋</p>}

        {messages.map((message) => (
          <Message key={message.id} message={message} />
        ))}

        <div ref={bottomRef}></div>
      </main>

      <ChatInput onSend={sendMessage} />
    </div>
  )
}

export default App
