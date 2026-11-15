import { useState } from 'react'
import { user_list } from './users.js'

const emojis = [
  '😀', '😂', '😊', '😍', '😎', '🤔', '😅', '😢',
  '😮', '😴', '🙌', '👍', '👋', '👏', '🙏', '💪',
  '🎉', '🔥', '❤️', '✅', '⭐', '☕', '🚀', '💡',
]

// The box at the bottom: text input, emoji picker, @mention list and Send button
function ChatInput({ onSend, disabled }) {
  const [text, setText] = useState('')
  const [showEmojis, setShowEmojis] = useState(false)

  // --- @mentions ---
  // Look at the last word being typed. If it starts with "@", show matching users.
  const words = text.split(' ')
  const lastWord = words[words.length - 1]
  const typedName = lastWord.slice(1).toLowerCase()
  const mentionList = lastWord.startsWith('@')
    ? user_list.filter((user) => user.toLowerCase().startsWith(typedName))
    : []

  function pickUser(user) {
    words[words.length - 1] = '@' + user // replace "@Bo" with "@Bob"
    setText(words.join(' ') + ' ')
  }

  // --- emojis ---
  function pickEmoji(emoji) {
    setText(text + emoji)
  }

  // --- send ---
  function handleSubmit(event) {
    event.preventDefault() // stop the form from reloading the page
    if (text.trim() === '' || disabled) return // don't send empty messages, or when offline

    onSend(text.trim())
    setText('')
    setShowEmojis(false)
  }

  return (
    <form className="chat-input" onSubmit={handleSubmit}>
      {mentionList.length > 0 && (
        <ul className="popup mention-list">
          {mentionList.map((user) => (
            <li key={user}>
              {/* onMouseDown + preventDefault keeps the cursor in the text box */}
              <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => pickUser(user)}>
                @{user}
              </button>
            </li>
          ))}
        </ul>
      )}

      {showEmojis && (
        <div className="popup emoji-panel">
          {emojis.map((emoji) => (
            <button
              key={emoji}
              type="button"
              className="emoji"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => pickEmoji(emoji)}
            >
              {emoji}
            </button>
          ))}
        </div>
      )}

      <div className="input-box">
        <input
          type="text"
          placeholder="Type a message… (use @ to mention someone)"
          value={text}
          onChange={(event) => setText(event.target.value)}
        />

        <button
          type="button"
          className={showEmojis ? 'icon-button active' : 'icon-button'}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => setShowEmojis(!showEmojis)}
          aria-label="Choose an emoji"
        >
          <i className="fa-regular fa-face-smile"></i>
        </button>

        <button type="submit" className="send-button" disabled={disabled}>
          Send <i className="fa-solid fa-paper-plane"></i>
        </button>
      </div>
    </form>
  )
}

export default ChatInput
