const indicator = require('../lib/index')
const createApp = require('./createApp')

function start(tray) {
  let progress = 0
  const tick = () => {
    indicator.progress({
      progress,
      tray: tray,
      type: 'circle',
      circle: {
        strockColor: '#208a4b',
        backgroundColor: '#ff0d4b',
      },
      text: {
        color: '#208a4b',
        font: 'italic normal 5px sans-serif',
        text: '{{progress}}%',
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
