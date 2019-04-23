const indicator = require('../lib/index')
const createApp = require('./createApp')

function start(tray) {
  const stop = indicator.indeterminate({
    tray,
  })

  // setTimeout(stop, 5000)
}

createApp(start)
