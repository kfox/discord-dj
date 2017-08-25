import test from 'ava'
import sinon from 'sinon'
import winston from 'winston'

import InvalidCommand from '../../lib/commands/invalid'
import HelpCommand from '../../lib/commands/help'

import MessageFixture from '../fixtures/message'

const logger = new (winston.Logger)({ level: 'silent' })
const sandbox = sinon.sandbox.create()
let args

test.beforeEach(t => {
  args = {
    logger: logger,
    message: MessageFixture
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

  t.true(
    invalidCommandReply.calledWithMatch({ content: 'Invalid command.' }),
    'calls message.reply with correct arguments'
  )
  t.true(
    helpCommandExec.calledWith(args),
    'calls help.exec with correct arguments'
  )
})
