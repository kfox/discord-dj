import test from 'ava'

import { uniqueIdentifier } from '../lib/user'

const USER = {
  username: 'Shakes The Clown',
  discriminator: '1234'
}

test('uniqueIdentifier', t => {
  t.deepEqual(
    uniqueIdentifier(USER),
    'Shakes The Clown#1234'
  )
})
