// invalid

import help from './help'
import { BaseCommand } from './base'

class InvalidCommand extends BaseCommand {
  constructor () {
    super()
    this.hidden = true
  }

  exec (args) {
    const { logger, message } = args
    this.reply(message, 'Invalid command.')
    return help.exec({
      logger: logger,
      message: message
    })
  }
}

const command = new InvalidCommand()
export { command as default }
