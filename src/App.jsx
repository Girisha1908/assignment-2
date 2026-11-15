import { useState, useEffect, useRef, useSyncExternalStore } from 'react'
import Message from './Message.jsx'
import ChatInput from './ChatInput.jsx'
import { socket } from './socket.js'
import './App.css'

const starterMessages = [
  {
    id: 'welcome',
    user: 'PubNub Bot',
    time: '12:16',
    text: 'Welcome to Team Chat. 👋👋 Send a message to connect with other users in the app. ⬇️',
  },
  {
    id: 'gregory',
    user: 'Gregory Goolsby',
    time: '17:28',
    text: 'Hey everyone!',
  },
  {
    id: 'elin',
    user: 'Elin Emanuel',
    time: '17:30',
    text: 'Oh hi, Gregory! Rolande is around, too.',
  },
]

function App() {
  const [messages, setMessages] = useState(starterMessages) // every message received so far
  const bottomRef = useRef(null) // an empty div at the end of the list
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

  // Subscribe to events from the server when the app starts
  useEffect(() => {
    function handleNewMessage(message) {
      setMessages((oldMessages) => [...oldMessages, message]) // add it to the end of the list
    }
    socket.on('new-message', handleNewMessage)

    // Unsubscribe when the app closes
    return () => {
      socket.off('new-message', handleNewMessage)
    }
  }, [])

  // Called by ChatInput when the user presses Send.
  // We only publish the text; the server adds the user and time and sends it back to everyone.
  function sendMessage(text) {
    socket.emit('send-message', text)
  }

  // After a new message appears, scroll down so it is visible
  useEffect(() => {
    bottomRef.current.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="profile">
          <div className="profile-avatar">RR<span className="presence-dot"></span></div>
          <div>
            <strong>Rolande Raimondi</strong>
            <span>Research Nurse</span>
          </div>
        </div>

        <div className="conversation-heading">
          <span>Conversations</span>
          <button type="button" className="add-button" aria-label="Add conversation">+</button>
        </div>

        <nav className="conversation-list" aria-label="Conversations">
          <button type="button" className="conversation">
            <span className="channel-icon">#</span>
            <span>Poland Office</span>
          </button>
          <button type="button" className="conversation active">
            <span className="channel-icon">#</span>
            <span>Introductions</span>
          </button>
          <button type="button" className="conversation">
            <span className="channel-icon">#</span>
            <span>India Office</span>
          </button>
        </nav>
      </aside>

      <section className="chat">
        <header className="chat-header">
          <div>
            <h1>Introductions</h1>
            <p>This Channel Is For Company Wide Chatter</p>
          </div>
          <div className="header-right">
            <span className={connected ? 'status online' : 'status offline'}>
              {connected ? 'Connected' : 'Server offline'}
            </span>
            <span className="message-count">{messages.length} | 100</span>
            <i className="fa-regular fa-user-group header-icon" aria-hidden="true"></i>
          </div>
        </header>

        <main className="messages">
          {messages.length === 0 && (
            <p className="empty">
              {connected ? 'No messages yet. Say hi 👋' : 'Start the server with "npm run dev" to chat.'}
            </p>
          )}

          {messages.map((message) => (
            <Message key={message.id} message={message} />
          ))}

          <div ref={bottomRef}></div>
        </main>

        <ChatInput onSend={sendMessage} disabled={!connected} />
      </section>
    </div>
  )
}

export default App
