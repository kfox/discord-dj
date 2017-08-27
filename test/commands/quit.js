import test from 'ava'
import sinon from 'sinon'
import winston from 'winston'

import QuitCommand from '../../lib/commands/quit'
import { uniqueIdentifier } from '../../lib/user'

import MessageFixture from '../fixtures/message'

const logger = new (winston.Logger)({ level: 'silent' })
const sandbox = sinon.sandbox.create()
let options, processExit

test.beforeEach(t => {
  processExit = sandbox.stub(process, 'exit')

  options = {
    logger: logger,
    message: MessageFixture
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

  await QuitCommand.exec(options)

  t.true(
    processExit.called,
    'calls process.exit'
  )
  t.true(
    loggerInfo.calledWithMatch(`'${uniqueIdentifier(MessageFixture.author)}' told me to quit`),
    'logs an appropriate message'
  )
  t.true(
    quitCommandReply.calledWithMatch({ content: 'Goodbye!' }),
    'calls message.reply with correct arguments'
  )
})

test.serial('exec with error', async t => {
  const loggerError = sandbox.stub(logger, 'error')
  const quitCommandReply = sandbox.stub(QuitCommand, 'reply').throws()

  await QuitCommand.exec(options)

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
