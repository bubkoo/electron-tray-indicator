const indicator = require('../lib/index')

let progress = 0

function progressTick(tray) {
  const tick = () => {
    indicator.progressTick({
      progress,
      tray: tray,
      type: 'pie',
      outline: {
        show: true,
      },
      circle: {
        backgroundColor: '#ff0000',
      },
      pie: {
        backgroundColor: '#ff0000',
      },
      text: {
        text: `{{  progress }}`
      }
    })

    progress += 0.5
    if (progress > 100) {
      progress = 0
    }

    setTimeout(tick, 16)
  }

  tick()
}

function indeterminateTick(tray) {
  indicator.indeterminateTick({
    tray,
    type: 'circle',
    pie: {
      backgroundColor: '#ff0000',
    },
    circle: {
      backgroundColor: '#ff0000',
    },
  })
}

module.exports = indeterminateTick
