import { Tray, ipcRenderer } from 'electron'

export type IndicatorStyle = 'pie' | 'circle'
export type IndicatorDirection = 'clockwise' | 'anticlockwise'

export interface OutlineOptions {
  show?: boolean,
  strockWidth?: number,
  strockColor?: string,
}

export interface TextOptions {
  text?: string,
  show?: boolean,
  color?: string,
  font?: string,
}

export interface PieOptions {
  fillColor?: string,
  backgroundColor?: string,
  size?: number,
}

export interface CircleOptions {
  strockWidth?: number,
  strockColor?: string,
  lineCap?: CanvasLineCap,
  backgroundColor?: string,
  size?: number,
}

export interface Options {
  tray: Tray,
  progress?: number,
  indeterminate?: boolean,
  size?: number,
  type?: IndicatorStyle,
  direction?: IndicatorDirection,
  text?: TextOptions,
  pie?: PieOptions,
  circle?: CircleOptions,
  outline?: OutlineOptions,
  speed?: 'slow' | 'normal' | 'fast'
}

class Graph {
  options: Options
  canvas: HTMLCanvasElement
  ctx: CanvasRenderingContext2D
  size: number
  radius: number
  center: { x: number, y: number }

  private angle = 0
  private animationFrameId: number

  constructor(options: Options) {
    this.options = options
    this.size = options.size!
    this.radius = Math.round(this.size / 2 * 0.83)
    this.center = {
      x: this.size / 2,
      y: this.size / 2,
    }

    this.canvas = document.createElement('canvas')
    this.canvas.width = this.size
    this.canvas.height = this.size
    document.body.prepend(this.canvas)

    this.ctx = this.canvas.getContext('2d')!

    this.autoscale()
  }

  dispose() {
    this.canvas.parentNode!.removeChild(this.canvas)
  }

  clean() {
    this.ctx.clearRect(0, 0, this.size, this.size)
  }

  getDataURL() {
    return this.canvas.toDataURL('image/png')
  }

  updateProgress() {
    this.drawOutline()
    this.drawProgress()
    this.drawText()

    return this
  }

  private drawOutline() {
    const ctx = this.ctx
    const outline = this.options.outline!
    if (outline.show) {
      ctx.save()
      ctx.beginPath()
      ctx.strokeStyle = outline.strockColor!
      ctx.lineWidth = outline.strockWidth!
      ctx.arc(this.center.x, this.center.y, this.radius, 0, Math.PI * 2)
      ctx.closePath()
      ctx.stroke()
      ctx.restore()
    }
  }

  private drawProgress() {
    const deg = Math.PI / 180
    const progress = this.options.progress! / 100
    const anticlockwise = this.options.direction === 'anticlockwise'

    const sDeg = -90 * deg
    const eDeg = anticlockwise
      ? (-progress * 360 - 1) * deg + sDeg
      : (progress * 360 + 1) * deg + sDeg

    if (this.options.type === 'pie') {
      this.drawPie(sDeg, eDeg, anticlockwise)
    } else if (this.options.type === 'circle') {
      this.drawArc(sDeg, eDeg, anticlockwise)
    }
  }

  private drawText() {
    const textOptions = this.options.text!
    if (textOptions.show) {
      const ctx = this.ctx
      const center = this.center
      const progress = Math.round(this.options.progress!)

      const text = textOptions.text == null
        ? `${progress}%`
        : textOptions.text.replace(/\{\{\s*progress\s*\}\}/g, `${progress}`)

      ctx.save()

      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.font = textOptions.font!
      ctx.fillStyle = textOptions.color!

      ctx.fillText(text, center.x, center.y)

      ctx.restore()
    }
  }

  startIndeterminate(callback: () => void) {
    this.updateIndeterminate(callback)
    this.animationFrameId = requestAnimationFrame(() => {
      this.startIndeterminate(callback)
    })
  }

  stopIndeterminate() {
    cancelAnimationFrame(this.animationFrameId)
  }

  private updateIndeterminate(callback: () => void) {
    this.clean()
    this.drawOutline()
    this.drawIndeterminate()
    this.drawText()

    const delta = { slow: 4, normal: 8, fast: 12 }[this.options.speed!]
    this.angle += delta
    this.angle = this.angle % 360

    callback()
  }

  private drawIndeterminate() {
    const deg = Math.PI / 180
    const anticlockwise = this.options.direction === 'anticlockwise'
    const size = this.options.type === 'pie'
      ? this.options.pie!.size!
      : this.options.type === 'circle'
        ? this.options.circle!.size!
        : 0

    const sDeg = anticlockwise
      ? (-90 - this.angle) * deg
      : (-90 + this.angle) * deg
    const eDeg = anticlockwise
      ? sDeg - size! * deg
      : sDeg + size! * deg

    if (this.options.type === 'pie') {
      this.drawPie(sDeg, eDeg, anticlockwise)
    } else if (this.options.type === 'circle') {
      this.drawArc(sDeg, eDeg, anticlockwise)
    }
  }

  private drawPie(sDeg: number, eDeg: number, anticlockwise: boolean) {
    const ctx = this.ctx
    const center = this.center
    const outline = this.options.outline!
    const pie = this.options.pie!

    let radius = this.radius
    if (outline.show) {
      radius -= (outline.strockWidth! / 2)
    }

    if (pie.backgroundColor) {
      ctx.save()
      ctx.fillStyle = pie.backgroundColor!
      ctx.beginPath()
      ctx.arc(this.center.x, this.center.y, radius, 0, Math.PI * 2)
      ctx.closePath()
      ctx.fill()
      ctx.restore()
    }

    ctx.save()

    ctx.fillStyle = pie.fillColor!
    ctx.translate(center.x, center.y)
    ctx.beginPath()
    ctx.arc(0, 0, radius, sDeg, eDeg, anticlockwise)

    ctx.save()
    ctx.rotate(eDeg)
    ctx.moveTo(radius, 0)
    ctx.lineTo(0, 0)

    ctx.restore()

    ctx.rotate(sDeg)
    ctx.lineTo(radius, 0)
    ctx.closePath()

    ctx.fill()
    ctx.restore()
  }

  private drawArc(sDeg: number, eDeg: number, anticlockwise: boolean) {
    const ctx = this.ctx
    const center = this.center
    const outline = this.options.outline!
    const circle = this.options.circle!

    let radius = this.radius
    if (outline.show) {
      radius -= (outline.strockWidth! / 2)
    }
    radius -= circle.strockWidth! / 2

    if (circle.backgroundColor) {
      ctx.save()
      ctx.beginPath()
      ctx.strokeStyle = circle.backgroundColor
      ctx.lineWidth = circle.strockWidth!
      ctx.arc(this.center.x, this.center.y, radius, 0, Math.PI * 2)
      ctx.closePath()
      ctx.stroke()
      ctx.restore()
    }

    ctx.save()

    ctx.lineWidth = circle.strockWidth!
    ctx.strokeStyle = circle.strockColor!
    ctx.translate(center.x, center.y)
    ctx.beginPath()
    ctx.arc(0, 0, radius, sDeg, eDeg, anticlockwise)
    ctx.lineCap = circle.lineCap!
    ctx.stroke()

    ctx.restore()
  }

  private getDevicePixelRatio() {
    return window.devicePixelRatio || 1
  }

  private autoscale() {
    const ratio = this.getDevicePixelRatio()
    if (1 !== ratio) {
      this.canvas.style.width = `${this.canvas.width}px`
      this.canvas.style.height = `${this.canvas.height}px`
      this.canvas.width *= ratio
      this.canvas.height *= ratio
      this.ctx.scale(ratio, ratio)
    }
  }
}

ipcRenderer.on('ETI_REQUEST_PROGRESS', (e: any, arg: {
  options: Options,
  id: string,
}) => {
  const graph = new Graph(arg.options)
  graph.updateProgress()
  ipcRenderer.send(`ETI_RESPONSE_PROGRESS_${arg.id}`, {
    dataURL: graph.getDataURL(),
  })
  graph.dispose()
})

const instances: { [key: string]: Graph } = {}

ipcRenderer.on('ETI_START_INDETERMINATE', (e: any, arg: {
  options: Options,
  id: string,
}) => {
  const graph = new Graph(arg.options)
  const callback = () => {
    ipcRenderer.send(`ETI_RESPONSE_INDETERMINATE_${arg.id}`, {
      dataURL: graph.getDataURL(),
    })
  }

  graph.startIndeterminate(callback)
  instances[arg.id] = graph
})

ipcRenderer.on('ETI_STOP_INDETERMINATE', (e: any, arg: {
  id: string,
}) => {
  const graph = instances[arg.id]

  graph.stopIndeterminate()
  graph.dispose()

  delete instances[arg.id]
})
