// ping.js

import BaseCommand from './base'

class PingCommand extends BaseCommand {
  constructor () {
    super()
    this.description = 'responds with "pong" if bot is working'
  }

  exec (options) {
    options.content = 'pong'
    return this.reply(options)
  }
}

const command = new PingCommand()
export { command as default }
