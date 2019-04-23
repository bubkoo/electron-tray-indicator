const indicator = require('../lib/index')
const createApp = require('./createApp')

function start(tray) {
  indicator.indeterminate({
    tray,
    type: 'circle',
    circle: {
      strockWidth: 3,
      strockColor: '#208a4b',
      backgroundColor: '#ff0d4b',
    },
  })
}

createApp(start)
