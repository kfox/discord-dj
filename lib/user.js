// user.js

export const uniqueIdentifier = (user) => {
  return `${user.username}#${user.discriminator}`
}
