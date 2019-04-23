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

export function getOptions(options: Options): Options {
  const opts: Options = {
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

  const defaultColor = getDefaultColor()
  const { outline, text, pie, circle } = opts

  if (outline) {
    if (outline.show == null) {
      if (opts.type === 'pie') {
        outline.show = true
      }
    }

    if (outline.strockWidth == null) {
      outline.strockWidth = 1
    }

    if (outline.strockColor == null) {
      outline.strockColor = defaultColor
    }
  }

  if (text) {
    if (text.show == null) {
      if (opts.type === 'pie') {
        text.show = false
      } else if (opts.type === 'circle') {
        text.show = true
      }
    }

    if (text.text == null) {
      text.text = options.indeterminate ? '' : '{{ progress }}%'
    }

    if (text.color == null) {
      text.color = defaultColor
    }

    if (text.font == null) {
      text.font = 'normal normal 5px sans-serif'
    }
  }

  if (pie) {
    if (pie.fillColor == null) {
      pie.fillColor = defaultColor
    }

    if (pie.size == null || pie.size < 0) {
      pie.size = 60
    }

    if (pie.size > 360) {
      pie.size = pie.size % 360
    }
  }

  if (circle) {
    if (circle.strockWidth == null) {
      circle.strockWidth = 2
    }

    if (circle.strockColor == null) {
      circle.strockColor = defaultColor
    }

    if (circle.lineCap == null) {
      circle.lineCap = 'round'
    }

    if (circle.size == null || circle.size < 0) {
      circle.size = 100
    }

    if (circle.size > 360) {
      circle.size = circle.size % 360
    }
  }

  if (options.type === 'pie') {
    options.text!.show = false
  }

  return opts
}

export interface ProgressOptions extends Options {
  progress: number
}

export function progressTick(options: ProgressOptions) {
  if (options.progress == null) {
    console.error('`progress` should be specified.')
  }

  if (options.progress < 0 || options.progress > 100) {
    console.error('`progress` should within the range of 0 to 100')
  }

  const opts: Options = {
    ...options,
    indeterminate: false,
  }

  return updateProgress(getOptions(opts))
}

export function indeterminateTick(options: Options) {
  const opts: Options = {
    ...options,
    indeterminate: true,
  }

  return startIndeterminate(getOptions(opts))
}

export function clean() {
  closeWindow()
}
