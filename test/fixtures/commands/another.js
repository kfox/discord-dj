import BaseCommand from '../../../lib/commands/base'

class AnotherCommand extends BaseCommand {
  constructor () {
    super()
    this.description = 'another command'
  }

  exec (args) {
    args.content = 'sproing'
    return this.reply(args)
  }
}

const command = new AnotherCommand()
export { command as default }
