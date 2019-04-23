import { app, ipcMain, Tray, BrowserWindow, nativeImage } from 'electron'
import { Options } from './render'

let window: null | BrowserWindow
let counter = 0

function createWindow(size: number) {
  window = new BrowserWindow({
    minimizable: false,
    maximizable: false,
    fullscreenable: false,
    resizable: false,
    movable: false,
    focusable: false,
    frame: false,
    transparent: true,
    webPreferences: {
      devTools: false,
    },
    width: size,
    height: size,
    x: -10000,
    y: -10000,
  })

  // window.setAlwaysOnTop(true, 'screen-saver')
  // window.webContents.openDevTools()

  window.setIgnoreMouseEvents(true)
  window.loadURL(`file://${__dirname}/index.html`)
}

function ensureWindow(size: number) {
  return new Promise((resolve) => {
    if (window) {
      resolve()
    } else {
      createWindow(size)
      let resolved = false
      const cb = () => {
        if (resolved) {
          return
        }
        resolved = true
        resolve()
      }

      window!.once('ready-to-show', cb)
      window!.webContents.once('did-finish-load', cb)
    }
  })
}

function updateTray(tray: Tray, dataURL: string, size: number) {
  const img = nativeImage.createFromDataURL(dataURL)
  const icon = img.resize({
    width: size,
    height: size,
    quality: 'best',
  })

  tray.setImage(icon)
}

function generateId() {
  counter += 1
  return counter
}

export function closeWindow() {
  if (window) {
    window.close()
    window = null
  }
}

export function updateProgress(options: Options): Promise<string> {
  return new Promise((resolve) => {
    const id = generateId()
    ensureWindow(options.size!).then(() => {
      window!.webContents.send('ETI_REQUEST_PROGRESS', { options, id })
      ipcMain.once(`ETI_RESPONSE_PROGRESS_${id}`, (e: Event, { dataURL }: { dataURL: string }) => {
        updateTray(options.tray, dataURL, options.size!)
        resolve(dataURL)
      })
    })
  })
}

export function startIndeterminate(options: Options) {
  const id = generateId()
  ensureWindow(options.size!).then(() => {
    window!.webContents.send('ETI_START_INDETERMINATE', { options, id })

    ipcMain.on(`ETI_RESPONSE_INDETERMINATE_${id}`, (e: Event, { dataURL }: { dataURL: string }) => {
      updateTray(options.tray, dataURL, options.size!)
    })
  })

  const stop = () => {
    window!.webContents.send('ETI_STOP_INDETERMINATE', { id })
  }

  return stop
}

app.on('before-quit', closeWindow)
