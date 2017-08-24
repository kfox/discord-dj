import test from 'ava'

import { queue as q } from '../lib/queue'
import { config } from '../lib/config'

const data = ['a', 'b', 'c']

test.beforeEach(t => {
  q.clear()
})

test('max queue size', t => {
  t.deepEqual(
    q.maxQueueSize,
    config.get('maxQueueSize')
  )
})

test('enqueue with an array argument', t => {
  const result = q.enqueue(data)

  t.deepEqual(
    result,
    data,
    'adds all array items'
  )
  t.deepEqual(
    q.length,
    data.length,
    'reports correct queue length'
  )
})

test('enqueue with a string argument', t => {
  const str = 'hello'
  const result = q.enqueue(str)

  t.deepEqual(
    result,
    [str],
    'adds a single item'
  )
})

test('enqueue more than max queue size', t => {
  const tooMuchData = Array(q.maxQueueSize + 1).fill(0)

  const error = t.throws(() => {
    q.enqueue(tooMuchData)
  }, RangeError)

  t.is(
    error.message,
    'Queue length exceeded',
    'throws a RangeError'
  )
})

test('dequeue with no arguments', t => {
  q.enqueue(data)
  const result = q.dequeue()

  t.deepEqual(
    result,
    [data[0]],
    'removes the first item'
  )
})

test('dequeue with an argument', t => {
  q.enqueue(data)
  const result = q.dequeue(3)

  t.deepEqual(
    result,
    data,
    'removes the number of items specified'
  )
})

test('iteration', t => {
  let enqueued = []

  q.enqueue(data)

  for (const item of q) {
    enqueued.push(item)
  }

  t.deepEqual(
    enqueued,
    data,
    'iterates over all elements'
  )
})

test('peek with no arguments', t => {
  q.enqueue(data)

  t.deepEqual(
    q.peek(),
    data,
    'shows the correct elements'
  )
})

test('peek with start specified', t => {
  q.enqueue(data)

  t.deepEqual(
    q.peek(1),
    data.slice(1),
    'shows the correct elements'
  )
})

test('peek with start and end specified', t => {
  q.enqueue(data)

  t.deepEqual(
    q.peek(0, 1),
    data.slice(0, 1),
    'shows the correct elements'
  )
})

test('combined operations', t => {
  q.enqueue(data)
  q.dequeue(2)
  q.enqueue('whoa')

  t.deepEqual(
    q.peek(),
    ['c', 'whoa'],
    'are successful'
  )
})
