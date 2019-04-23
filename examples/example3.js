const indicator = require('../lib/index')
const createApp = require('./createApp')

function start(tray) {
  indicator.indeterminateTick({
    tray,
  })
}

createApp(start)
