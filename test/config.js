import fs from 'fs'
import { resolve } from 'path'

import test from 'ava'
import sinon from 'sinon'

import config from '../lib/config'
import defaults from '../lib/defaults'

const sandbox = sinon.sandbox.create()
const configFileName = resolve(
  process.cwd(), 'config', 'config.json'
)
const BASE_CONFIG = defaults.config

test.afterEach.always(t => {
  sandbox.restore()
})

const loadFakeConfig = () => {
  sandbox.stub(fs, 'accessSync')
  sandbox.stub(fs, 'readFileSync').callsFake((file, options) => {
    return JSON.stringify(BASE_CONFIG)
  })
  config.load()
}

test('config.get with valid argument', t => {
  loadFakeConfig()

  for (let [key, value] of Object.entries(BASE_CONFIG)) {
    t.deepEqual(
      config.get(key),
      value,
      `returns the value for ${key}`
    )
  }
})

test('config.get with invalid argument', t => {
  loadFakeConfig()

  t.deepEqual(
    config.get('foobar'),
    null,
    'returns null'
  )
})

test('config.get with no arguments', t => {
  loadFakeConfig()

  const response = config.get()

  t.deepEqual(
    response.prefix,
    BASE_CONFIG.prefix
  )

  t.deepEqual(
    response.maxQueueSize,
    BASE_CONFIG.maxQueueSize
  )
})

test('config.set', t => {
  const save = sandbox.stub(config, 'save')
  const TOKEN = 'abcd1234'

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
  sandbox.stub(fs, 'accessSync').throws()
  sandbox.stub(fs, 'readFileSync').callsFake((file, options) => {
    return JSON.stringify({ meep: true })
  })

  config.load()

  t.deepEqual(
    config.get(),
    BASE_CONFIG,
    'default config is loaded'
  )
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
