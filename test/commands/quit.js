import test from 'ava'
import sinon from 'sinon'
import winston from 'winston'

import QuitCommand from '../../lib/commands/quit'
import { uniqueIdentifier } from '../../lib/user'

import message from '../fixtures/message'

const logger = new (winston.Logger)({ level: 'silent' })
const sandbox = sinon.sandbox.create()
let args, processExit

test.beforeEach(t => {
  processExit = sandbox.stub(process, 'exit')

  args = {
    logger: logger,
    message: message
  }
})

test.afterEach.always(t => {
  sandbox.restore()
})

test('init', t => {
  t.false(
    QuitCommand.hidden,
    'marks the command as visible'
  )
  t.is(
    QuitCommand.description,
    'terminates the bot',
    'sets the description'
  )
})

test.serial('exec', async t => {
  const loggerInfo = sandbox.stub(logger, 'info')
  const quitCommandReply = sandbox.stub(QuitCommand, 'reply')

  await QuitCommand.exec(args)

  t.true(
    processExit.called,
    'calls process.exit'
  )
  t.true(
    loggerInfo.calledWith(`'${uniqueIdentifier(message.author)}' told me to quit`),
    'logs an appropriate message'
  )
  t.true(
    quitCommandReply.calledWith(args),
    'calls message.reply with correct arguments'
  )
})

test.serial('exec with error', async t => {
  const loggerError = sandbox.stub(logger, 'error')
  const quitCommandReply = sandbox.stub(QuitCommand, 'reply').throws()

  await QuitCommand.exec(args)

  t.true(
    processExit.called,
    'calls process.exit'
  )
  t.true(
    quitCommandReply.threw(),
    'throws an Error'
  )
  t.true(
    loggerError.called,
    'logged the error'
  )
})
