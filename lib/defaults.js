// defaults.js

const Defaults = () => {}

Defaults.prototype.config = {
  logging: {
    level: 'info'
  },
  maxQueueSize: 250,
  prefix: '!',
  token: '',
  client: {
    messageCacheLifetime: 30,
    messageSweepInterval: 10,
    disabledEvents: [
      'MESSAGE_REACTION_ADD',
      'MESSAGE_REACTION_REMOVE',
      'MESSAGE_REACTION_REMOVE_ALL',
      'TYPING_START'
    ]
  }
}

const defaults = new Defaults()
export { defaults as default }
