// entry point

import winston from 'winston'
import Discord from 'discord.js'

import config from './config'
import handlers from './handlers'

export default function main (args) {
  const { client, logger, token } = args

  logger.info('Discord-DJ starting')

  client.login(token)

  client.once('ready', handlers.readyHandler.bind(null, logger))
  client.on('message', handlers.messageHandler.bind(null, logger))
  client.on('error', handlers.errorHandler.bind(null, logger))

  process.stdin.resume()

  process.once('exit', handlers.exitHandler.bind(null, { cleanup: true }, logger))
  process.once('SIGINT', handlers.exitHandler.bind(null, { exit: true }, logger))
  process.once('unhandledRejection', handlers.exitHandler.bind(null, { exit: true }, logger))
  process.once('uncaughtException', handlers.exitHandler.bind(null, { exit: true }, logger))
}

/* istanbul ignore next */
if (process.env.NODE_ENV !== 'test') {
  const client = new Discord.Client(config.get('client'))

  const logger = new winston.Logger({
    level: config.get('logging').level,
    transports: [
      new winston.transports.Console({
        timestamp: true
      }),
      new winston.transports.File({
        filename: './log/discord-dj.log',
        timestamp: true
      })
    ],
    exceptionHandlers: [
      new winston.transports.Console({
        timestamp: true
      }),
      new winston.transports.File({
        filename: './log/unhandled-exceptions.log',
        humanReadableUnhandledException: true,
        timestamp: true
      })
    ]
  })

  main({
    client: client,
    logger: logger,
    token: config.get('token')
  })
}
