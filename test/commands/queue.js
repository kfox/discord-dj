import test from 'ava'
import sinon from 'sinon'
import winston from 'winston'

import q from '../../lib/queue'
import { formatDuration } from '../../lib/utils'
import QueueCommand from '../../lib/commands/queue'

import MessageFixture from '../fixtures/message'
import SongFixtures from '../fixtures/songs'

const logger = new (winston.Logger)({ level: 'silent' })
const sandbox = sinon.sandbox.create()
let options

test.beforeEach(t => {
  options = {
    logger: logger,
    message: MessageFixture
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
  t.deepEqual(
    QueueCommand.aliases,
    ['q'],
    'sets the aliases'
  )
})

test('exec with no queue', t => {
  const queueCommandReply = sandbox.stub(QueueCommand, 'reply')

  QueueCommand.exec(options)

  t.true(
    queueCommandReply.calledWithMatch({ content: 'No songs queued.' }),
    'calls message.reply with correct arguments'
  )
})

test('exec with queue', t => {
  const queueCommandReply = sandbox.stub(QueueCommand, 'reply')

  const songList = Object.values(SongFixtures).sort((a, b) => {
    return a.title.localeCompare(b.title)
  })

  q.enqueue(songList)
  QueueCommand.exec(options)

  let expected = `${songList.length} songs queued:\n`

  for (let song of songList) {
    expected += `${song.title} (${formatDuration(song.duration)})\n`
  }

  t.true(
    queueCommandReply.calledWithMatch({ content: expected }),
    'calls message.reply with correct arguments'
  )
})
