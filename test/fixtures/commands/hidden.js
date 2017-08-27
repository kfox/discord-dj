import BaseCommand from '../../../lib/commands/base'

class HiddenCommand extends BaseCommand {
  constructor () {
    super()
    this.hidden = true
    this.description = 'a hidden command'
  }

  exec (options) {
    options.content = 'waka waka waka'
    return this.reply(options)
  }
}

const command = new HiddenCommand()
export { command as default }
