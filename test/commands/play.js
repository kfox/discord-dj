import test from 'ava'
import sinon from 'sinon'

import PlayCommand from '../../lib/commands/play'

const sandbox = sinon.sandbox.create()

test.afterEach.always(t => {
  sandbox.restore()
})

test('init', t => {
  t.false(
    PlayCommand.hidden,
    'marks the command as visible'
  )
  t.is(
    PlayCommand.description,
    'plays/enqueues a song or playlist given a URL or search string',
    'sets the description'
  )
  t.deepEqual(
    PlayCommand.aliases,
    ['p'],
    'sets the aliases'
  )
})
