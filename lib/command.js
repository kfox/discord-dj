// command.js

import config from './config'
import allCommands from './commands'

const list = (commands = allCommands) => {
  return Array
    .from(Object.values(commands))
    .filter(command => {
      return command && !command.hidden
    })
}

const resolve = name => {
  return list().find(c => {
    return c.commandName === name || c.aliases.includes(name)
  }) || allCommands.InvalidCommand
}

const exec = (logger, message) => {
  const prefix = config.get('prefix')
  const commandString = message.content.trim().toLowerCase().slice(prefix.length)
  let commandName = commandString
  let commandArgs = ''

  if (/\s/.test(commandString)) {
    [commandName, commandArgs] = [
      commandString.split(' ', 1)[0],
      commandString.slice(commandString.indexOf(' ')).trim()
    ]
  }

  const command = resolve(commandName)

  return command.exec({
    commandArgs: commandArgs,
    logger: logger,
    message: message
  })
}

export { exec, list, resolve }
