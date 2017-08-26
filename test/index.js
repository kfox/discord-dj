import fs from 'fs'

import test from 'ava'
import sinon from 'sinon'

import winston from 'winston'
import Discord from 'discord.js'

import config from '../lib/config'
import handlers from '../lib/handlers'

import MessageFixture from './fixtures/message'

import main from '../lib/index'

const sandbox = sinon.sandbox.create()
const client = new Discord.Client()
const logger = new (winston.Logger)({ level: 'silent' })

let clientLogin, loggerInfo, options
let errorHandler, exitHandler, messageHandler, readyHandler

const loadFakeConfig = () => {
  sandbox.stub(fs, 'accessSync').throws()
  config.load()
}

test.beforeEach(t => {
  loadFakeConfig()

  options = {
    client: client,
    logger: logger,
    token: 'abcd1234'
  }

  clientLogin = sandbox.stub(client, 'login')
  loggerInfo = sandbox.stub(logger, 'info')
  errorHandler = sandbox.stub(handlers, 'errorHandler')
  exitHandler = sandbox.stub(handlers, 'exitHandler')
  messageHandler = sandbox.stub(handlers, 'messageHandler')
  readyHandler = sandbox.stub(handlers, 'readyHandler')
})

test.afterEach.always(t => {
  sandbox.restore()
})

test('main', t => {
  main(options)

  t.true(
    loggerInfo.calledWith('Discord-DJ starting'),
    'logs a startup message'
  )
  t.true(
    clientLogin.calledWithMatch(options.token),
    'attempts to log in with the token'
  )
})

test.serial('on client ready', async t => {
  main(options)

  await client.emit('ready')

  t.true(
    readyHandler.calledWith(options.logger),
    'ready handler called correctly'
  )
})

test.serial('on client message', async t => {
  main(options)

  await client.emit('message', MessageFixture)

  t.true(
    messageHandler.calledWith(options.logger, sinon.match(MessageFixture)),
    'message handler called correctly'
  )
})

test.serial('on client error', async t => {
  const err = new Error()

  main(options)

  await client.emit('error', err)

  t.true(
    errorHandler.calledWith(options.logger, sinon.match(err)),
    'error handler called correctly'
  )
})

test.serial('on process exit', async t => {
  main(options)

  await process.emit('exit')

  t.true(
    exitHandler.called,
    'exit handler called'
  )
})

test.serial('on SIGINT', async t => {
  main(options)

  await process.emit('SIGINT')

  t.true(
    exitHandler.called,
    'exit handler called'
  )
})
