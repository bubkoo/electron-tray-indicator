const indicator = require('../lib/index')
const createApp = require('./createApp')

function start(tray) {
  indicator.indeterminate({
    tray,
    type: 'circle',
  })
}

createApp(start)
