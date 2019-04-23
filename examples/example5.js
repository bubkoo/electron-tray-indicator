const indicator = require('../lib/index')
const createApp = require('./createApp')

function start(tray) {
  let progress = 0
  const tick = () => {
    indicator.progress({
      progress,
      tray: tray,
      outline: {
        show: true,
        strockWidth: 1,
        strockColor: '#ff0d4b',
      },
      pie: {
        fillColor: '#208a4b',
        backgroundColor: '#ff0d4b',
      },
    })

    progress += 0.5
    if (progress > 100) {
      progress = 0
    }

    setTimeout(tick, 16)
  }

  tick()
}

createApp(start)
