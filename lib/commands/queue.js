// queue.js

import { queue as q } from '../queue'
import { formatDuration } from '../utils'
import { BaseCommand } from './base'

class QueueCommand extends BaseCommand {
  constructor () {
    super()
    this.description = 'shows the current song queue'
  }

  exec (args) {
    let response = 'No songs queued.'

    if (q.length) {
      response = `${q.length} songs queued:\n`

      for (let item of q) {
        response += `${item.title} (${formatDuration(item.duration)})\n`
      }
    }

    args.content = response

    return this.reply(args)
  }
}

const command = new QueueCommand()
export { command as default }
