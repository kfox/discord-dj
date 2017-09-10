import fs from 'fs'

import test from 'ava'
import sinon from 'sinon'

import Discord from 'discord.js'

import config from '../lib/config'
import logger from '../lib/logger'
import defaults from '../lib/defaults'
import handlers from '../lib/handlers'

import MessageFixture from './fixtures/message'

import main from '../lib/index'

const client = new Discord.Client()
const sandbox = sinon.sandbox.create()
const BASE_CONFIG = defaults.config
BASE_CONFIG.token = 'abcd1234'

let clientLogin, options
let errorHandler, exitHandler, messageHandler, readyHandler

const loadFakeConfig = () => {
  sandbox.stub(fs, 'accessSync')
  sandbox.stub(fs, 'readFileSync').callsFake((file, options) => {
    return JSON.stringify(BASE_CONFIG)
  })
  config.load()
}

test.beforeEach(t => {
  loadFakeConfig()

  clientLogin = sandbox.stub(client, 'login')
  errorHandler = sandbox.stub(handlers, 'errorHandler')
  exitHandler = sandbox.stub(handlers, 'exitHandler')
  messageHandler = sandbox.stub(handlers, 'messageHandler')
  readyHandler = sandbox.stub(handlers, 'readyHandler')

  options = {
    client: client,
    logger: logger
  }
})

test.afterEach.always(t => {
  sandbox.restore()
})

test('main', t => {
  main(options)

  t.true(
    clientLogin.calledWithMatch(BASE_CONFIG.token),
    'attempts to log in with the token'
  )
})

test.serial('on client ready', async t => {
  main(options)

  await client.emit('ready')

  t.true(
    readyHandler.calledWith(options),
    'ready handler called correctly'
  )
})

test.serial('on client message', async t => {
  main(options)

  await client.emit('message', MessageFixture)

  t.true(
    messageHandler.calledWith(options, sinon.match(MessageFixture)),
    'message handler called correctly'
  )
})

test.serial('on client error', async t => {
  const err = new Error()

  main(options)

  await client.emit('error', err)

  t.true(
    errorHandler.calledWith(options, sinon.match(err)),
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
