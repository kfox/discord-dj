// entry point

import winston from 'winston'
import Discord from 'discord.js'

import config from './config'
import { errorHandler, exitHandler, messageHandler, readyHandler } from './handlers'

const logger = new winston.Logger({
  level: 'info',
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

export const main = () => {
  logger.info('Discord-DJ starting')

  const client = new Discord.Client(config.get('client'))
  client.login(config.get('token'))

  client.once('ready', readyHandler.bind(null, logger))
  client.on('message', messageHandler.bind(null, logger))
  client.on('error', errorHandler.bind(null, logger))

  process.stdin.resume()

  process.once('exit', exitHandler.bind(null, { cleanup: true }, logger))
  process.once('SIGINT', exitHandler.bind(null, { exit: true }, logger))
  process.once('unhandledRejection', exitHandler.bind(null, { exit: true }, logger))
  process.once('uncaughtException', exitHandler.bind(null, { exit: true }, logger))
}

main()
