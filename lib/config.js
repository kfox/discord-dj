// config.js

import { accessSync, readFileSync, writeFileSync } from 'fs'
import { resolve } from 'path'

import defaults from './defaults'

class Config {
  constructor () {
    this._currentConfig = {}

    Object.assign(
      this._currentConfig,
      defaults.config
    )

    this.load()
  }

  get (item) {
    let response = null

    if (!item) {
      response = this._currentConfig
    } else if (this._currentConfig.hasOwnProperty(item)) {
      response = this._currentConfig[item]
    }

    return response
  }

  set (item, value) {
    this._currentConfig[item] = value
    this.save()

    return value
  }

  load (file = this.configFileName) {
    try {
      accessSync(file)
      Object.assign(
        this._currentConfig,
        JSON.parse(readFileSync(file))
      )
    } catch (_) {}

    return this._currentConfig
  }

  save (file = this.configFileName) {
    writeFileSync(
      file,
      JSON.stringify(this._currentConfig, null, 2) + '\n'
    )
  }
}

Config.prototype.configFileName = resolve(
  process.cwd(), 'config', 'config.json'
)

const config = new Config()
export { config as default }
