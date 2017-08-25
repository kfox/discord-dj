import test from 'ava'
import sinon from 'sinon'
import winston from 'winston'

import { BaseCommand } from '../../lib/commands/base'

import MessageFixture from '../fixtures/message'

const logger = new (winston.Logger)({ level: 'silent' })
const sandbox = sinon.sandbox.create()
let args

test.beforeEach(t => {
  args = {
    content: 'The dolphin is in the jacuzzi',
    logger: logger,
    message: MessageFixture,
    options: { foo: 'bar' }
  }
})

test.afterEach.always(t => {
  sandbox.restore()
})

test.serial('reply calls message.reply', async t => {
  const messageReply = sandbox.stub(MessageFixture, 'reply')

  await BaseCommand.reply(args)

  t.true(
    messageReply.calledWith(args.content, args.options),
    'with correct arguments'
  )
})

test.serial('reply handles errors', async t => {
  const messageReply = sandbox.stub(MessageFixture, 'reply').throws()
  const loggerError = sandbox.stub(logger, 'error')

  await BaseCommand.reply(args)

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

  await BaseCommand.reply(args)

  t.true(
    loggerInfo.calledWith(`Replied to '${initiator}' with '${args.content}'`)
  )
  t.true(
    loggerError.notCalled
  )
})
