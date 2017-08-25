import test from 'ava'
import sinon from 'sinon'
import winston from 'winston'

import PingCommand from '../../lib/commands/ping'

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
  t.false(
    PingCommand.hidden,
    'marks the command as visible'
  )
  t.is(
    PingCommand.description,
    'responds with "pong" if bot is working',
    'sets the description'
  )
})

test('exec', t => {
  const pingCommandReply = sandbox.stub(PingCommand, 'reply')

  PingCommand.exec(args)

  t.true(
    pingCommandReply.calledWithMatch({ content: 'pong' }),
    'calls message.reply with correct arguments'
  )
})
