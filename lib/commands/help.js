// help.js

import columnify from 'columnify'

import BaseCommand from './base'
import { list as commandList } from '../command'

class HelpCommand extends BaseCommand {
  constructor () {
    super()
    this.description = 'shows this message'
  }

  exec (options) {
    const columnOptions = {
      columnSplitter: ' | ',
      columns: [
        'commandNameWithPrefix',
        'aliases',
        'description'
      ],
      config: {
        commandNameWithPrefix: {
          headingTransform: heading => { return 'COMMAND' }
        }
      },
      preserveNewLines: true
    }

    const sortedCommandList = commandList().sort((a, b) => {
      return a.commandName.localeCompare(b.commandName)
    })

    options.content = '```\n' +
      columnify(sortedCommandList, columnOptions) +
      '```\n'

    return this.reply(options)
  }
}

const command = new HelpCommand()
export { command as default }
