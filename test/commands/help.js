import test from 'ava'
import sinon from 'sinon'
import columnify from 'columnify'
import winston from 'winston'

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
  t.false(
    HelpCommand.hidden,
    'marks the command as visible'
  )
  t.is(
    HelpCommand.description,
    'shows this message',
    'sets the description'
  )
})

test.serial('exec', t => {
  const helpCommandReply = sandbox.stub(HelpCommand, 'reply')

  HelpCommand.exec(args)

  t.true(
    helpCommandReply.calledWith(args),
    'calls message.reply with correct arguments'
  )
})
