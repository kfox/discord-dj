import fs from 'fs'
import { homedir } from 'os'

import test from 'ava'
import sinon from 'sinon'

import { config } from '../lib/config'
import { defaults } from '../lib/defaults'

const sandbox = sinon.sandbox.create()
const configFileName = `${homedir()}/.config/discord-dj/config.json`
const TOKEN = 'abcd1234'
const BASE_CONFIG = defaults.config

test.afterEach.always(t => {
  sandbox.restore()
})

test('config.get with valid argument', t => {
  for (let [key, value] of Object.entries(BASE_CONFIG)) {
    t.deepEqual(
      config.get(key),
      value,
      `returns the value for ${key}`
    )
  }
})

test('config.get with invalid argument', t => {
  t.deepEqual(
    config.get('foobar'),
    null,
    'returns null'
  )
})

test('config.get with no arguments', t => {
  const response = config.get()

  t.deepEqual(
    response.debug,
    BASE_CONFIG.debug
  )

  t.deepEqual(
    response.maxQueueSize,
    BASE_CONFIG.maxQueueSize
  )
})

test('config.set', t => {
  const save = sandbox.stub(config, 'save')
  const load = sandbox.stub(config, 'load')

  config.set('token', TOKEN)

  t.is(
    config.get('token'),
    TOKEN,
    'values are set correctly'
  )
  t.true(
    save.called,
    'config.save was called for config change'
  )
  t.true(
    load.notCalled,
    'config.load was not called for config change'
  )
})

test('config.load', t => {
  let filename

  sandbox.stub(fs, 'accessSync')
  sandbox.stub(fs, 'readFileSync').callsFake((file, options) => {
    filename = file
    return JSON.stringify(BASE_CONFIG)
  })

  t.notThrows(
    () => { config.load() },
    'file is loaded'
  )
  t.deepEqual(
    filename,
    configFileName,
    'reads the correct file'
  )
  t.deepEqual(
    config.get(),
    BASE_CONFIG,
    'config is loaded correctly'
  )
})

test('config.load with config missing', t => {
  sandbox.stub(fs, 'accessSync').callsFake(path => {
    throw new Error()
  })

  const error = t.throws(
    () => { config.load() },
    Error
  )

  t.is(error.message, 'config file missing')
})

test('config.save', t => {
  let filename, writtenConfig

  sandbox.stub(fs, 'writeFileSync').callsFake((file, data, options) => {
    writtenConfig = data
    filename = file
    return undefined
  })

  config.save()

  t.deepEqual(
    filename,
    configFileName,
    'writes to the correct file'
  )
  t.deepEqual(
    writtenConfig,
    JSON.stringify(BASE_CONFIG, null, 2) + '\n',
    'writes the correct data'
  )
})
