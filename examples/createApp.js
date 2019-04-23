const path = require('path')
const electron = require('electron')

module.exports = function (indicator) {
  const { app, Tray, Menu, } = electron
  let tray

  function createTray() {
    console.log()
    tray = new Tray(path.join(__dirname, 'icon.png'))
    tray.setContextMenu(Menu.buildFromTemplate([
      {
        label: 'Quit',
        role: 'quit',
        accelerator: 'Cmd+Q',
      }
    ]))
  }

  app.dock.hide()

  app.on('ready', () => {
    createTray()
    indicator(tray)
  })

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit()
    }
  })
}
