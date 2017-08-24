// quit.js

import { uniqueIdentifier } from '../user'
import { BaseCommand } from './base'

class QuitCommand extends BaseCommand {
  constructor () {
    super()
    this.description = 'terminates the bot'
  }

  async exec (args) {
    try {
      args.content = 'Goodbye!'
      args.logger.info(`'${uniqueIdentifier(args.message.author)}' told me to quit`)
      await this.reply(args)
    } catch (err) {
      args.logger.error(err)
    }

    process.exit()
  }
}

const command = new QuitCommand()
export { command as default }
