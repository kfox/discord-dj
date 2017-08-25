// queue.js

import config from './config'

class Queue {
  constructor () {
    this.clear()
  }

  clear () {
    this.q = []
  }

  dequeue (max = 1) {
    if (max >= this.q.length) { max = this.q.length }

    let dequeued = []

    for (let index = 0; index < max; index++) {
      dequeued.push(this.q.shift())
    }

    return dequeued
  }

  enqueue (items) {
    items = [].concat([], items)

    for (const item of items) {
      if (this.q.length >= this.maxQueueSize) {
        throw new RangeError('Queue length exceeded')
      }

      this.q.push(item)
    }

    return this.q
  }

  peek (start = 0, end = this.maxQueueSize) {
    return this.q.slice(start, end)
  }

  get length () {
    return this.q.length
  }

  * iterator () {
    for (const item of this.q) yield item
  }

  [Symbol.iterator] () {
    return this.iterator()
  }
}

Queue.prototype.maxQueueSize = config.get('maxQueueSize')

const queue = new Queue()
export { queue as default }
