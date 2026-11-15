# React Chat App

Assignment 2 for the Exactspace Front End / UI Developer Internship.

A single-page chat app with a small Express + socket.io server.
Type a message and press **Send** (or Enter). The message goes to the server, which sends it to every open browser tab,
so you can open the app in two tabs and chat between them.

Messages are not saved anywhere. They disappear when you refresh the page or restart the server.

## Features

- Each message is given a random user from `["Alan", "Bob", "Carol", "Dean", "Elin"]` (the server picks it)
- Each message shows the user's avatar, name and the time it was sent
- Like button at the right end of every message. The count starts at 0 and goes up by 1 on each click.
  Likes are only counted in your own browser tab; they are not sent to the server.
- Empty messages are not sent
- A "Connected" / "Server offline" badge in the header. While the server is offline, the Send button is disabled.

### Stretch goals done

1. **Emojis**: the smiley button opens a panel of 24 emojis. Clicking one adds it to the message.
2. **Mentions**: typing `@` shows the user list. Typing more letters (for example `@Ca`) narrows the list. Clicking a name fills it in, and mentions are highlighted in blue in the sent message.
3. **socket.io server**: `server.js` is an Express server with socket.io on port 3001.
   - The browser **publishes** the text on the `send-message` event.
   - The server adds a random user, the time and an id, then sends the message to all browsers on the `new-message` event.
   - Every browser **subscribes** to `new-message` and adds the message to its list.

## Run it locally

```bash
npm install
npm run dev
```

`npm run dev` starts both the chat server (port 3001) and the React app (Vite, usually http://localhost:5173).
Open the React app's address in two tabs to see messages arrive in both.

You can also start them separately with `npm run server` and `npm run client`.

## Architecture

```text
Browser
  |
  | types a message
  v
React app
  ├─ ChatInput.jsx   - message input, emojis and mentions
  ├─ App.jsx         - message list and connection status
  └─ Message.jsx     - one message and its like button
  |
  | socket.io: send-message
  v
server.js
  ├─ adds a random user, time and id
  └─ broadcasts new-message to every connected browser
```

`index.html` loads the React app. `src/socket.js` creates the single
socket.io connection, `src/users.js` contains shared user data, and the CSS
files contain the page styles. Vite creates `dist/` only during a production
build; it is generated output and is ignored by Git.

## How WebSockets work

Socket.IO keeps one open connection between the browser and `server.js`.

1. `ChatInput.jsx` calls `socket.emit('send-message', text)` when the form is submitted.
2. `server.js` receives the text, adds the user, time and id, then calls `io.emit('new-message', message)`.
3. `App.jsx` listens with `socket.on('new-message', ...)` and adds the message to the screen.
4. Every open browser receives the same event, so messages appear in every tab immediately.

Run `npm run dev`, open the app in two tabs, and send a message to see the
WebSocket connection in action.

## Tech

React + Vite, plain CSS, Font Awesome, Express, socket.io, and `concurrently` (to run the server and the app with one command).
