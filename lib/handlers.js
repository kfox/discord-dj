import config from './config'
import { exec } from './command'

const errorHandler = (options, err) => {
  const { logger } = options
  logger.error(err)
}

const exitHandler = (options, flags = {}, err) => {
  const { logger } = options

  if (flags.cleanup) logger.info('Exiting')
  if (err) logger.error(err.stack)
  if (flags.exit) process.exit()
}

const messageHandler = (options, message) => {
  const { logger } = options

  if (
    message.system ||
    message.author.bot ||
    !message.guild ||
    !message.content.startsWith(config.get('prefix'))
  ) return

  logger.debug(message)

  options.message = message
  exec(options)
}

const readyHandler = options => {
  const { logger } = options
  // `==> Logged in as ${client.user.tag}`
  logger.info('Logged in')
}

export default { errorHandler, exitHandler, messageHandler, readyHandler }
