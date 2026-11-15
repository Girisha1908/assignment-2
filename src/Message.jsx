import { useState } from 'react'
import { user_list, userColors } from './users.js'

// One chat message: avatar, name, time, the text and a like button on the right
function Message({ message }) {
  const [likes, setLikes] = useState(0) // every message starts with 0 likes

  // Split the text into words so we can highlight @mentions like "@Bob"
  const words = message.text.split(' ')
  const avatarColor = userColors[message.user] || '#d8e66a'

  return (
    <article className="message">
      <div className="avatar" style={{ background: avatarColor }}>
        {message.user.slice(0, 2).toUpperCase()}
      </div>

      <div className="message-body">
        <div className="message-info">
          <span className="message-user">{message.user}</span>
          <span className="message-time">{message.time}</span>
        </div>

        <div className="message-row">
          <p className="bubble">
            {words.map((word, index) => {
              const isMention = word.startsWith('@') && user_list.includes(word.slice(1))
              return (
                <span key={index} className={isMention ? 'mention' : ''}>
                  {word}{' '}
                </span>
              )
            })}
          </p>

          <button
            className={likes > 0 ? 'like-button liked' : 'like-button'}
            onClick={() => setLikes(likes + 1)}
            aria-label="Like message"
          >
            <i className="fa-solid fa-thumbs-up"></i>
            <span>{likes}</span>
          </button>
        </div>
      </div>
    </article>
  )
}

export default Message
