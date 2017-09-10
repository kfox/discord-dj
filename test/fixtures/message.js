import config from '../../lib/config'

export default {
  author: {
    bot: false,
    discriminator: '1234',
    username: 'Snake Vargas'
  },
  content: config.get('prefix') + 'ping',
  guild: true,
  reply: async (content, options) => {},
  system: false,
  member: {
    voiceChannel: {
      id: '304667045398708224',
      name: 'Gaming',
      type: 'voice'
    }
  }
}
