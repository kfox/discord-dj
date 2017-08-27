import BaseCommand from '../../../lib/commands/base'

class AnotherCommand extends BaseCommand {
  constructor () {
    super()
    this.description = 'another command'
  }

  exec (options) {
    options.content = 'sproing'
    return this.reply(options)
  }
}

const command = new AnotherCommand()
export { command as default }
