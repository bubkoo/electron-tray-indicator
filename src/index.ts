import { systemPreferences } from 'electron'
import { updateProgress, startIndeterminate, closeWindow } from './main'
import { Options } from './render'

function getDefaultColor() {
  if (process.platform !== 'darwin') {
    return '#191919'
  }

  return systemPreferences.isDarkMode()
    ? '#ffffff'
    : '#191919'
}

function getOptions(options: Options): Options {
  const result: Options = {
    size: 22,
    type: 'pie',
    direction: 'clockwise',
    speed: 'normal',
    outline: {},
    text: {},
    pie: {},
    circle: {},
    ...options,
  }

  const { outline, text, pie, circle } = result
  const defaultColor = getDefaultColor()

  if (outline) {
    if (outline.show == null) {
      if (result.type === 'pie') {
        outline.show = true
      }
    }
  }

  result.outline = {
    strockWidth: 1,
    strockColor: defaultColor,
    ...outline,
  }

  if (text) {
    if (text.show == null) {
      if (result.type === 'circle') {
        text.show = true
      }
    }

    if (options.type === 'pie') {
      text!.show = false
    }

    if (text.show && text.render == null) {
      text.render = options.progress === false ? '' : '{{ progress }}%'
    }
  }

  result.text = {
    color: defaultColor,
    fontFamily: 'arial',
    fontSize: 5,
    ...text,
  }

  result.pie = {
    fillColor: defaultColor,
    arc: 60,
    ...pie,
  }

  result.circle = {
    lineCap: 'round',
    strockWidth: 2,
    strockColor: defaultColor,
    arc: 100,
    ...circle,
  }

  return result
}

export function progress(options: Options) {
  if (options.progress == null) {
    console.error('`progress` should be specified.')
  }

  if (
    options.progress === false ||
    (options.progress as number) < 0 ||
    (options.progress as number) > 100
  ) {
    console.error('`progress` should within the range of 0 to 100')
  }

  return updateProgress(getOptions(options))
}

export function indeterminate(options: Options) {
  const opts: Options = {
    ...options,
    progress: false,
  }

  return startIndeterminate(getOptions(opts))
}

export function clean() {
  closeWindow()
}
