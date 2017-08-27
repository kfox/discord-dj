// queue.js

import q from '../queue'
import { formatDuration } from '../utils'
import BaseCommand from './base'

class QueueCommand extends BaseCommand {
  constructor () {
    super()
    this.aliases = ['q']
    this.description = 'shows the current song queue'
  }

  exec (options) {
    let response = 'No songs queued.'

    if (q.length) {
      response = `${q.length} songs queued:\n`

      for (let item of q) {
        response += `${item.title} (${formatDuration(item.duration)})\n`
      }
    }

    options.content = response

    return this.reply(options)
  }
}

const command = new QueueCommand()
export { command as default }
