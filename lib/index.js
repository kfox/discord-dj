// entry point

import { Logger } from 'winston'
import Discord from 'discord.js'

import { Config } from './config'
import * as handlers from './handlers.js'

const config = Config.get()
const logger = new Logger(config.loggingOptions)
const client = new Discord.Client(config.clientOptions)

client.login(config.token)

client.once('ready', handlers.readyHandler.bind(null, logger))
client.on('message', handlers.messageHandler.bind(null, logger))
client.on('error', handlers.errorHandler.bind(null, logger))

process.stdin.resume()

process.once('exit', handlers.exitHandler.bind(null, { cleanup: true }, logger))
process.once('SIGINT', handlers.exitHandler.bind(null, { exit: true }, logger))
process.once('uncaughtException', handlers.exitHandler.bind(null, { exit: true }, logger))
