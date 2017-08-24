// invalid

import help from './help'
import { BaseCommand } from './base'

class InvalidCommand extends BaseCommand {
  constructor () {
    super()
    this.hidden = true
  }

  exec (args) {
    args.content = 'Invalid command.'
    this.reply(args)
    return help.exec(args)
  }
}

const command = new InvalidCommand()
export { command as default }
