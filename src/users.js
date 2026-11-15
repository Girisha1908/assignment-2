// The people who can "send" messages. Each message gets one of them at random.
export const user_list = ['Alan', 'Bob', 'Carol', 'Dean', 'Elin']

// A colour for each user's avatar and name (dark enough to read on white)
export const userColors = {
  Alan: '#e5484d',
  Bob: '#3b82f6',
  Carol: '#a37a00',
  Dean: '#8b5cf6',
  Elin: '#e0613f',
}

export function getRandomUser() {
  const index = Math.floor(Math.random() * user_list.length)
  return user_list[index]
}
