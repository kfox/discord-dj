// logger.js

import winston from 'winston'

import config from './config'

const env = process.env.NODE_ENV

const logger = (() => {
  /* istanbul ignore if */
  if (env === 'production') {
    return new winston.Logger({
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
  } else {
    return new winston.Logger({
      level: env === 'test' ? 'silent' : /* istanbul ignore next */ 'debug',
      transports: [
        new winston.transports.Console({
          prettyPrint: true,
          timestamp: true
        })
      ],
      exceptionHandlers: [
        new winston.transports.Console({
          prettyPrint: true,
          timestamp: true
        })
      ]
    })
  }
})()

export { logger as default }
