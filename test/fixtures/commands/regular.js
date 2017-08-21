import { BaseCommand } from '../../../lib/commands/base'

class RegularCommand extends BaseCommand {
  constructor () {
    super()
    this.aliases = ['r', 'reg']
    this.description = 'a regular command'
  }

  exec (args) {
    args.content = 'boink'
    return this.reply(args)
  }
}

const command = new RegularCommand()
export { command as default }
