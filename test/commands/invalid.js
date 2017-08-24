import test from 'ava'
import sinon from 'sinon'
import winston from 'winston'

import InvalidCommand from '../../lib/commands/invalid'
import HelpCommand from '../../lib/commands/help'

import message from '../fixtures/message'

const logger = new (winston.Logger)({ level: 'silent' })
const sandbox = sinon.sandbox.create()
let args

test.beforeEach(t => {
  args = {
    logger: logger,
    message: message
  }
})

test.afterEach.always(t => {
  sandbox.restore()
})

test('init', t => {
  t.true(
    InvalidCommand.hidden,
    'marks the command as hidden'
  )
})

test.serial('exec', async t => {
  const invalidCommandReply = sandbox.stub(InvalidCommand, 'reply')
  const helpCommandExec = sandbox.stub(HelpCommand, 'exec')

  await InvalidCommand.exec(args)
  args.content = 'Invalid command.'

  t.true(
    invalidCommandReply.calledWith(args),
    'calls message.reply with correct arguments'
  )
  t.true(
    helpCommandExec.calledWith(args),
    'calls help.exec with correct arguments'
  )
})
