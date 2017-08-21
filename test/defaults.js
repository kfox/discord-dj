import test from 'ava'

import { defaults } from '../lib/defaults'

const DEFAULTS = {
  loggingOptions: {
    level: 'info'
  },
  maxQueueSize: 250,
  prefix: '!',
  token: '',
  clientOptions: {
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
