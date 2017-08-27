// invalid

import help from './help'
import BaseCommand from './base'

class InvalidCommand extends BaseCommand {
  constructor () {
    super()
    this.hidden = true
  }

  exec (options) {
    options.content = 'Invalid command.'
    this.reply(options)
    return help.exec(options)
  }
}

const command = new InvalidCommand()
export { command as default }
