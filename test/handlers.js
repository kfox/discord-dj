import test from 'ava'
import sinon from 'sinon'
import winston from 'winston'

import * as command from '../lib/command.js'
import handlers from '../lib/handlers'

import MessageFixture from './fixtures/message'

const logger = new (winston.Logger)({ level: 'silent' })
const sandbox = sinon.sandbox.create()

let message, options, errorLogger, infoLogger, processExit, commandExec

test.beforeEach(t => {
  message = MessageFixture

  options = {
    cleanup: false,
    exit: false
  }

  errorLogger = sandbox.stub(logger, 'error')
  infoLogger = sandbox.stub(logger, 'info')
  processExit = sandbox.stub(process, 'exit')
  commandExec = sandbox.stub(command, 'exec')
})

test.afterEach.always(t => {
  sandbox.restore()
})

test('errorHandler', t => {
  handlers.errorHandler(logger, 'foo')

  t.true(
    errorLogger.calledWithMatch('foo'),
    'logs an error message'
  )
})

test('exitHandler with no options', t => {
  handlers.exitHandler(logger)

  t.true(
    infoLogger.notCalled,
    'logger.info was not called'
  )
  t.true(
    errorLogger.notCalled,
    'logger.error was not called'
  )
  t.true(
    processExit.notCalled,
    'process.exit was not called'
  )
})

test('exitHandler with options.cleanup', t => {
  options.cleanup = true
  handlers.exitHandler(logger, options)

  t.true(
    infoLogger.called,
    'logger.info was called'
  )
  t.true(
    errorLogger.notCalled,
    'logger.error was not called'
  )
  t.true(
    processExit.notCalled,
    'process.exit was not called'
  )
})

test('exitHandler with options.exit', t => {
  options.exit = true
  handlers.exitHandler(logger, options)

  t.true(
    infoLogger.notCalled,
    'logger.info was not called'
  )
  t.true(
    errorLogger.notCalled,
    'logger.error was not called'
  )
  t.true(
    processExit.called,
    'process.exit was called'
  )
})

test('exitHandler with error', t => {
  const err = new Error()
  handlers.exitHandler(logger, options, err)

  t.true(
    errorLogger.calledWithMatch(err.stack),
    'error stack was dumped'
  )
})

test('messageHandler', t => {
  handlers.messageHandler(logger, message)
  t.true(
    commandExec.called,
    'commandExec was called'
  )
})

test('messageHandler with system message', t => {
  message.system = true
  handlers.messageHandler(logger, message)
  t.true(
    commandExec.notCalled,
    'commandExec was not called'
  )
})

test('messageHandler with bot message', t => {
  message.author.bot = true
  handlers.messageHandler(logger, message)
  t.true(
    commandExec.notCalled,
    'commandExec was not called'
  )
})

test('messageHandler with non-guild message', t => {
  message.guild = false
  handlers.messageHandler(logger, message)
  t.true(
    commandExec.notCalled,
    'commandExec was not called'
  )
})

test('messageHandler with non-command message', t => {
  message.content = '?ping'
  handlers.messageHandler(logger, message)
  t.true(
    commandExec.notCalled,
    'commandExec was not called'
  )
})

test('readyHandler', t => {
  handlers.readyHandler(logger)
  t.true(
    infoLogger.called,
    'logs a standard message'
  )
})
