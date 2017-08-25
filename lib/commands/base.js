// base.js

import config from '../config'

class BaseCommand {
  constructor () {
    this.aliases = []
    this.args = null
    this.commandName = this.constructor.commandName
    this.commandNameWithPrefix = this.constructor.commandNameWithPrefix
    this.description = ''
    this.details = ''
    this.examples = [
      // each example uses the following format:
      // { example: '', description: '' }
    ]
    this.hidden = false
    this.reply = this.constructor.reply
  }

  static async reply (args) {
    const { content, logger, message, options } = args
    const initiator = `${message.author.username}#${message.author.discriminator}`

    try {
      const response = await message.reply(content, options)
      logger.info(`Replied to '${initiator}' with '${content}'`)
      logger.debug(response)
    } catch (err) {
      logger.error(err)
    }
  }

  static get commandName () {
    return this.name.replace(/Command$/, '').toLowerCase()
  }

  static get commandNameWithPrefix () {
    return config.get('prefix') + this.commandName
  }
}

export { BaseCommand as default }
