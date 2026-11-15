// The people who can "send" messages. Each message gets one of them at random.
export const user_list = ['Alan', 'Bob', 'Carol', 'Dean', 'Elin']

// A colour for each user's avatar circle
export const userColors = {
  Alan: '#e8505b',
  Bob: '#4c8bf5',
  Carol: '#c7d34a',
  Dean: '#9b6bd6',
  Elin: '#f08a78',
  'PubNub Bot': '#df5057',
  'Gregory Goolsby': '#d9e86a',
  'Elin Emanuel': '#ed9295',
}

export function getRandomUser() {
  const index = Math.floor(Math.random() * user_list.length)
  return user_list[index]
}
