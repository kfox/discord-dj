// entry point

import Discord from 'discord.js'

import config from './config'
import handlers from './handlers'
import logger from './logger'

export default function main (options) {
  const { client } = options

  client.login(config.get('token'))

  client.once('ready', handlers.readyHandler.bind(null, options))
  client.on('message', handlers.messageHandler.bind(null, options))
  client.on('error', handlers.errorHandler.bind(null, options))

  process.stdin.resume()

  process.once('exit', handlers.exitHandler.bind(null, { cleanup: true }, options))
  process.once('SIGINT', handlers.exitHandler.bind(null, { exit: true }, options))
  process.once('unhandledRejection', handlers.exitHandler.bind(null, { exit: true }, options))
  process.once('uncaughtException', handlers.exitHandler.bind(null, { exit: true }, options))
}

/* istanbul ignore next */
if (process.env.NODE_ENV !== 'test') {
  logger.info('Discord-DJ starting')

  const client = new Discord.Client(config.get('client'))

  main({
    client: client,
    logger: logger
  })
}
