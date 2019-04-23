const indicator = require('../lib/index')
const createApp = require('./createApp')

function start(tray) {
  indicator.indeterminateTick({
    tray,
    type: 'circle',
  })
}

createApp(start)
