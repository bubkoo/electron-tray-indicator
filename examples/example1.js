const indicator = require('../lib/index')
const createApp = require('./createApp')

function start(tray) {
  let progress = 0
  const tick = () => {
    indicator.progress({
      progress,
      tray: tray,
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
