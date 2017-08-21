// debug.js

import { queue as q } from '../queue'
import { BaseCommand } from './base'

class QueueCommand extends BaseCommand {
  constructor () {
    super()
    this.description = 'shows the current song queue'
  }

  exec (args) {
    const { logger, message } = args
    let response = 'No songs queued.'

    if (q.length) {
      response = `${q.length} songs queued:\n`

      q.forEach(item => {
        const [s = '0', m = '0', h = '0'] = item.duration.split(/:/).reverse()
        response += `${item.title} (${h}:${m.padStart(2, '0')}:${s.padStart(2, '0')})\n`
      })
    }

    return this.reply({
      logger: logger,
      message: message,
      content: response
    })
  }
}

const command = new QueueCommand()
export { command as default }
