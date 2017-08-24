import test from 'ava'

import { formatDuration } from '../lib/utils'

const durations = [
  { original: undefined, formatted: '0:00' },
  { original: '', formatted: '0:00' },
  { original: '1', formatted: '0:01' },
  { original: '1:0', formatted: '1:00' },
  { original: '1:3', formatted: '1:03' },
  { original: '1:30', formatted: '1:30' },
  { original: '0:0:0', formatted: '0:00' },
  { original: '0:0:30', formatted: '0:30' },
  { original: '0:4:30', formatted: '4:30' },
  { original: '1:0:30', formatted: '1:00:30' },
  { original: '1:0:0', formatted: '1:00:00' },
  { original: '1:2:0', formatted: '1:02:00' },
  { original: '5:55:55', formatted: '5:55:55' }
]

test('formatDuration', t => {
  for (let duration of durations) {
    t.is(
      formatDuration(duration.original),
      duration.formatted,
      `"${duration.original}" is formatted as "${duration.formatted}"`
    )
  }
})
