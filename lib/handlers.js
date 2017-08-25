import config from './config'
import { exec } from './command'

const errorHandler = (logger, err) => {
  logger.error(err)
}

const exitHandler = (logger, options = {}, err) => {
  if (options.cleanup) logger.info('Exiting')
  if (err) logger.error(err.stack)
  if (options.exit) process.exit()
}

const messageHandler = (logger, message) => {
  if (
    message.system ||
    message.author.bot ||
    !message.guild ||
    !message.content.startsWith(config.get('prefix'))
  ) return

  logger.debug(message)

  exec(logger, message)
}

const readyHandler = logger => {
  // `==> Logged in as ${client.user.tag}`
  logger.info('Logged in')
}

export { errorHandler, exitHandler, messageHandler, readyHandler }
