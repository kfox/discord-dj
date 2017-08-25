import test from 'ava'
import sinon from 'sinon'
import winston from 'winston'

import { config } from '../lib/config'
import * as command from '../lib/command.js'
import InvalidCommand from '../lib/commands/invalid'
import PingCommand from '../lib/commands/ping'
import PlayCommand from '../lib/commands/play'

import CommandFixtures from './fixtures/commands'
import MessageFixture from './fixtures/message'

const logger = new (winston.Logger)({ level: 'silent' })
const sandbox = sinon.sandbox.create()
let message

test.beforeEach(t => {
  message = MessageFixture
})

test.afterEach.always(t => {
  sandbox.restore()
})

test('list', t => {
  t.deepEqual(
    command.list(CommandFixtures).length,
    2,
    'does not return hidden commands'
  )
})

test('resolve with valid command name', t => {
  t.deepEqual(
    command.resolve('ping'),
    PingCommand,
    'finds the correct command'
  )
})

test('resolve with valid command alias', t => {
  t.deepEqual(
    command.resolve('p'),
    PlayCommand,
    'finds the correct command'
  )
})

test('resolve with invalid command name', t => {
  t.deepEqual(
    command.resolve('foo'),
    InvalidCommand,
    'returns InvalidCommand'
  )
})

test('exec', t => {
  const pingCommandExec = sandbox.stub(PingCommand, 'exec')

  command.exec(logger, message)

  t.true(
    pingCommandExec.called,
    'PingCommand.exec was called'
  )

  t.true(
    pingCommandExec.calledWith({
      commandArgs: '',
      logger: logger,
      message: message
    }),
    'PingCommand.exec was called with the correct arguments'
  )
})

test('exec with arguments', t => {
  const pingCommandExec = sandbox.stub(PingCommand, 'exec')

  message.content = config.get('prefix') + 'ping me baby'
  command.exec(logger, message)

  t.true(
    pingCommandExec.calledWith({
      commandArgs: 'me baby',
      logger: logger,
      message: message
    }),
    'PingCommand.exec was called with the correct arguments'
  )
})
