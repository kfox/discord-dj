// config.js

import { accessSync, readFileSync, writeFileSync } from 'fs'
import { homedir } from 'os'
import { resolve } from 'path'

import { defaults } from './defaults'

class Config {
  constructor () {
    this._currentConfig = {}

    Object.assign(
      this._currentConfig,
      defaults.config
    )
  }

  get (item) {
    let response = null

    if (!item) {
      response = this._currentConfig
    }

    if (this._currentConfig.hasOwnProperty(item)) {
      response = this._currentConfig[item]
    }

    return response
  }

  set (item, value) {
    this._currentConfig[item] = value
    this.save()
    return value
  }

  load () {
    let file = this.configFileName

    try {
      accessSync(file)
    } catch (_) {
      throw new Error('config file missing')
    }

    Object.assign(
      this._currentConfig,
      JSON.parse(readFileSync(file))
    )
  }

  save () {
    let file = this.configFileName

    writeFileSync(
      file,
      JSON.stringify(this._currentConfig, null, 2) + '\n'
    )
  }
}

Config.prototype.configFileName = resolve(
  homedir(), '.config', 'discord-dj', 'config.json'
)

export const config = new Config()
