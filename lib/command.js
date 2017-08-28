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

const exec = options => {
  const { message } = options
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

  options.commandArgs = commandArgs
  const command = resolve(commandName)

  return command.exec(options)
}

export { exec, list, resolve }
