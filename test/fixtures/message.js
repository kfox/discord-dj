import { config } from '../../lib/config'

export default {
  author: {
    bot: false,
    discriminator: '1234',
    username: 'Snake Vargas'
  },
  content: config.get('prefix') + 'ping',
  guild: true,
  system: false
}
