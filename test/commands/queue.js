import test from 'ava'
import sinon from 'sinon'
import winston from 'winston'

import { queue as q } from '../../lib/queue'
import { formatDuration } from '../../lib/utils'
import QueueCommand from '../../lib/commands/queue'

import message from '../fixtures/message'
import * as songs from '../fixtures/songs'

const logger = new (winston.Logger)({ level: 'silent' })
const sandbox = sinon.sandbox.create()
let args

test.beforeEach(t => {
  args = {
    logger: logger,
    message: message
  }

  q.clear()
})

test.afterEach.always(t => {
  sandbox.restore()
})

test('init', t => {
  t.false(
    QueueCommand.hidden,
    'marks the command as visible'
  )
  t.is(
    QueueCommand.description,
    'shows the current song queue',
    'sets the description'
  )
})

test('exec with no queue', t => {
  const queueCommandReply = sandbox.stub(QueueCommand, 'reply')

  QueueCommand.exec(args)

  t.true(
    queueCommandReply.calledWith(sinon.match({ content: 'No songs queued.' })),
    'calls message.reply with correct arguments'
  )
})

test('exec with queue', t => {
  const queueCommandReply = sandbox.stub(QueueCommand, 'reply')

  const songList = Object.values(songs).sort((a, b) => {
    return a.title.localeCompare(b.title)
  })

  q.enqueue(songList)
  QueueCommand.exec(args)

  let expected = `${songList.length} songs queued:\n`

  for (let song of songList) {
    expected += `${song.title} (${formatDuration(song.duration)})\n`
  }

  t.true(
    queueCommandReply.calledWithMatch({ content: expected }),
    'calls message.reply with correct arguments'
  )
})
