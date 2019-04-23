const indicator = require('../lib/index')
const createApp = require('./createApp')

function start(tray) {
  indicator.indeterminateTick({
    tray,
    outline: {
      show: false,
    },
    pie: {
      size: 80,
      fillColor: '#208a4b',
      backgroundColor: '#ff0d4b',
    },
  })
}

createApp(start)
