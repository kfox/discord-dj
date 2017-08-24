import test from 'ava'
import sinon from 'sinon'
import winston from 'winston'
import columnify from 'columnify'

import HelpCommand from '../../lib/commands/help'
import * as command from '../../lib/command.js'

import message from '../fixtures/message'
import * as commands from '../fixtures/commands'

const logger = new (winston.Logger)({ level: 'silent' })
const sandbox = sinon.sandbox.create()
let args

const columnOptions = {
  columnSplitter: ' | ',
  columns: [
    'commandNameWithPrefix',
    'aliases',
    'description'
  ],
  config: {
    commandNameWithPrefix: {
      headingTransform: heading => { return 'COMMAND' }
    }
  }
}

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

test('exec', t => {
  const helpCommandReply = sandbox.stub(HelpCommand, 'reply')

  HelpCommand.exec(args)

  t.true(
    helpCommandReply.calledWithMatch(args),
    'calls message.reply with correct arguments'
  )
})

test('output', t => {
  const helpCommandReply = sandbox.stub(HelpCommand, 'reply')
  const commandList = sandbox.stub(command, 'list')
    .returns(Object.values(commands))
  const sortedCommandList = Object.values(commands).sort((a, b) => {
    return a.commandName.localeCompare(b.commandName)
  })

  HelpCommand.exec(args)

  t.true(
    helpCommandReply.calledWithMatch({
      content: columnify(sortedCommandList, columnOptions)
    }),
    'is properly formatted'
  )
  t.true(
    commandList.called,
    'command.list was called'
  )
})
