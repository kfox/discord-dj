import test from 'ava'
import sinon from 'sinon'
import winston from 'winston'

import BaseCommand from '../../lib/commands/base'

import MessageFixture from '../fixtures/message'

const logger = new (winston.Logger)({ level: 'silent' })
const sandbox = sinon.sandbox.create()
let options

test.beforeEach(t => {
  options = {
    content: 'The dolphin is in the jacuzzi',
    logger: logger,
    message: MessageFixture,
    replyOptions: { foo: 'bar' }
  }
})

test.afterEach.always(t => {
  sandbox.restore()
})

test.serial('reply calls message.reply', async t => {
  const messageReply = sandbox.stub(MessageFixture, 'reply')

  await BaseCommand.reply(options)

  t.true(
    messageReply.calledWithMatch(options.content, options.replyOptions),
    'with correct arguments'
  )
})

test.serial('reply handles errors', async t => {
  const messageReply = sandbox.stub(MessageFixture, 'reply').throws()
  const loggerError = sandbox.stub(logger, 'error')

  await BaseCommand.reply(options)

  t.true(
    messageReply.threw()
  )
  t.true(
    loggerError.called
  )
})

test.serial('reply logs response', async t => {
  const initiator = `${MessageFixture.author.username}#${MessageFixture.author.discriminator}`
  const loggerError = sandbox.stub(logger, 'error')
  const loggerInfo = sandbox.stub(logger, 'info')

  await BaseCommand.reply(options)

  t.true(
    loggerInfo.calledWithMatch(`Replied to '${initiator}' with '${options.content}'`)
  )
  t.true(
    loggerError.notCalled
  )
})
