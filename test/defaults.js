import test from 'ava'

import { defaults } from '../lib/defaults'

const DEFAULTS = {
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

test('default config', t => {
  t.deepEqual(
    defaults.config,
    DEFAULTS
  )
})
