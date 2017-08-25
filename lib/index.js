// entry point

import { Logger } from 'winston'
import Discord from 'discord.js'

import { Config } from './config'
import { errorHandler, exitHandler, messageHandler, readyHandler } from './handlers'

const config = Config.get()
const logger = new Logger(config.loggingOptions)
const client = new Discord.Client(config.clientOptions)

client.login(config.token)

client.once('ready', readyHandler.bind(null, logger))
client.on('message', messageHandler.bind(null, logger))
client.on('error', errorHandler.bind(null, logger))

process.stdin.resume()

process.once('exit', exitHandler.bind(null, { cleanup: true }, logger))
process.once('SIGINT', exitHandler.bind(null, { exit: true }, logger))
process.once('uncaughtException', exitHandler.bind(null, { exit: true }, logger))
