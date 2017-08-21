// play.js

import YouTube from 'youtube-dl'
import Request from 'request'

import { queue as q } from '../queue'
import { client } from '../connections'
import { BaseCommand } from './base'

class PlayCommand extends BaseCommand {
  constructor () {
    super()
    this.aliases = ['p']
    this.description = 'plays/enqueues a song or playlist given a URL or search string'
    this.examples = [
      {
        example: 'https://youtu.be/9bZkp7q19f0',
        description: 'plays PSY - GANGNAM STYLE(강남스타일) M/V'
      },
      {
        example: 'rick roll',
        description: 'plays Rick Astley - Never Gonna Give You Up'
      },
      {
        example: 'https://www.youtube.com/playlist?list=PL9tY0BWXOZFt2TyOofWG0XwA8IDC8SGIN',
        description: 'enqueues the songs from Vevo\'s "Brand New POP" playlist'
      }
    ]
  }

  async exec (args) {
    let { logger, message, commandArgs: request } = args
    const voiceChannel = message.member.voiceChannel

    if (!voiceChannel) {
      return this.reply({
        message: message,
        content: 'You need to join a voice channel first!'
      })
    }

    if (!request.startsWith('http')) {
      request = 'gvsearch1:' + request
    }

    try {
      const response = await message.channel.send('Searching...')

      YouTube.getInfo(request, ['-q', '--no-warnings'], (err, info) => {
        if (err || !info.format_id || info.format_id.startsWith('0')) {
          return response.edit('No results.')
        }

        logger.debug(info)

        q.enq({
          duration: info.duration,
          title: info.title,
          url: info.url
        })

        response.edit('Queued: ' + info.title)
          .catch(err => { logger.error(err) })

        const connection = client.voiceConnections.first()
        const dispatcher = connection.playStream(Request(info.url))

        dispatcher.on('error', err => {
          response.edit('Error during playback: ' + info.title)
          logger.error(err)
        })

        dispatcher.on('start', () => {
          response.edit('Now playing: ' + info.title)
            .catch(err => { logger.error(err) })
        })
      })
    } catch (err) {
      logger.error(err)
    }
  }
}

const command = new PlayCommand()
export { command as default }
