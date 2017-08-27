// quit.js

import { uniqueIdentifier } from '../user'
import BaseCommand from './base'

class QuitCommand extends BaseCommand {
  constructor () {
    super()
    this.description = 'terminates the bot'
  }

  async exec (options) {
    const { logger, message } = options

    try {
      options.content = 'Goodbye!'
      logger.info(`'${uniqueIdentifier(message.author)}' told me to quit`)
      await this.reply(options)
    } catch (err) {
      logger.error(err)
    }

    process.exit()
  }
}

const command = new QuitCommand()
export { command as default }
