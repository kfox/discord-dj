// ping.js

import BaseCommand from './base'

class PingCommand extends BaseCommand {
  constructor () {
    super()
    this.description = 'responds with "pong" if bot is working'
  }

  exec (args) {
    args.content = 'pong'
    return this.reply(args)
  }
}

const command = new PingCommand()
export { command as default }
