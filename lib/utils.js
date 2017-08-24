// utils.js

export const formatDuration = (duration = '') => {
  /* istanbul ignore next */
  const [seconds = '0', minutes = '0', hours = '0'] = duration.split(/:/).reverse()
  let formatted = ''

  if (parseInt(hours) > 0) { formatted += hours + ':' }
  if (parseInt(minutes) < 10 && formatted !== '') {
    formatted += minutes.padStart(2, '0') + ':'
  } else {
    formatted += minutes + ':'
  }
  formatted += seconds.padStart(2, '0')

  return formatted
}
