import * as PIXI from 'pixi.js'
const CARD_WIDTH = 50
const CARD_HEIGHT = 50
const CLOCK_WIDTH = 100
const CLOCK_HEIGHT = 50
class FontCard {
  constructor({ name, x, y, texture, errorTexture, answer, canChange }) {
    this.texture = texture
    this.position = { x: x, y: y }
    this.errorTexture = errorTexture
    this.spirit = new PIXI.Sprite(texture)
    this.spirit.width = CARD_WIDTH
    this.spirit.height = CARD_HEIGHT
    this.spirit.position.set(x, y)
    this._error = false
    this._name = ''
    this.name = name
    this.answer = answer
    this.canChange = canChange
    if (!this.canChange) {
      this.createFont(this.answer)
    }
  }
  createFont(value) {
    const font = new PIXI.Text(value, {
      fontSize: (CARD_WIDTH / 2) * window.devicePixelRatio,
      fill: 0x333333,
      align: 'center'
    })
    font.anchor.set(0.5)
    font.position.set(
      (CARD_WIDTH / 2) * window.devicePixelRatio,
      (CARD_HEIGHT / 2) * window.devicePixelRatio
    )
    this.spirit.addChild(font)
  }
  get name() {
    return this._name
  }
  set name(value) {
    if (value != this._name && this.canChange) {
      //如果是清除值并且有子元素
      if (!value && this.spirit.children.length > 0) {
        this.spirit.removeChildren(0)
      }
      //如果是替换
      if (value) {
        this.spirit.removeChildren(0)
        this.createFont(value)
      }

      this._name = value
    }
  }
  get error() {
    return this._error
  }
  set error(value) {
    if (!this.canChange) return
    value = !!value
    if (value != this._error) {
      this.spirit.texture = value ? this.selectedTexture : this.texture
    }
    this._error = value
  }
  destroy() {
    this.spirit.destroy()
  }
}
class MatchCard {
  constructor({ name, x, y }) {
    this.graphic = new PIXI.Graphics()
    this.graphic.lineStyle(2, 0x666666, 1, 0)
    this.graphic.beginFill(0xffffff)
    this.graphic.drawRect(x, y, CARD_WIDTH, CARD_HEIGHT)
    this.graphic.endFill()
    this.graphic.interactive = true
    this.graphic.on('pointerdown', this.onDragStart)
    this.graphic.on('pointerup', this.onDragEnd)
    this.graphic.on('pointerupoutside', this.onDragEnd)
    this.graphic.on('pointermove', this.onDragMove)
  }
  onDragStart(event) {
    console.log(event, this)
  }
  onDragEnd() {}
  onDragMove(event) {}
}
class Clock {
  /**
   *
   * @param {number} time 总计时 单位：秒
   */
  constructor({ time, texture1, texture2, x, y, width, height }) {
    this.time = time * 1000
    this.position = { x, y }
    this.texture1 = texture1
    this.texture2 = texture2
    //背景纹理
    this.spirit = new PIXI.Sprite(texture1)
    this.spirit.width = width
    this.spirit.height = height
    this.spirit.anchor.set(0.5)
    this.spirit.position.set(x, y)
    //
    const timeString = this.getTimeString(this.time)
    this.text = new PIXI.Text(timeString, {
      fontSize: (height / 2) * window.devicePixelRatio,
      fill: 0xffffff,
      align: 'center'
    })
    this.text.anchor.set(0.5)
    this.text.position.set(0, 0)

    this.spirit.addChild(this.text)
  }
  /**
   *
   * @param {*} time 单位毫秒
   */
  getTimeString(time) {
    let sec = Math.floor(time / 1000) % 60
    let min = Math.floor(time / 60000)
    sec = sec < 10 ? '0' + sec : '' + sec
    min = min < 10 ? '0' + min : '' + min
    return min + ':' + sec
  }
  updateTime() {
    this.time -= 500
    this.text.text = this.getTimeString(this.time)
    if (this.time < 10 * 1000) {
      if (this.time % 1000 != 0) {
        this.spirit.texture = this.texture2
      } else {
        this.spirit.texture = this.texture1
      }
    }
    //结束
    if (this.time == 0) {
      this.stop()
    }
  }
  start() {
    if (!this.clock) {
      this.clock = setInterval(this.updateTime.bind(this), 500)
    }
  }
  stop() {
    this.clock && clearInterval(this.clock) && (this.clock = null)
  }
  destroy() {
    this.stop()
    this.spirit.destroy()
  }
}
class IdiomGame {
  constructor({ canvas, canvasWidth, canvasHeight, difficulty }) {
    this.canvas = canvas
    this.canvasWidth = canvasWidth
    this.canvasHeight = canvasHeight
    this.pixiApp = new PIXI.Application({
      view: canvas,
      antialias: true,
      backgroundColor: 0x75a2e6,
      resolution: window.devicePixelRatio,
      width: canvasWidth,
      height: canvasHeight
    })
    this.stage = this.pixiApp.stage
    this.ticker = this.pixiApp.ticker
    this.render = this.pixiApp.renderer
    this.scale = window.devicePixelRatio
    this.tableHeight = this.canvasHeight / 3
    this.resultStartY = (this.tableHeight - CARD_HEIGHT) / 2
    this.difficulty = difficulty
    this.spirits = {}
    this.init()
  }
  createTexture() {
    const scale = window.devicePixelRatio
    const graphic1 = new PIXI.Graphics()
    graphic1.lineStyle(2 * scale, 0x666666, 1, 0)
    graphic1.beginFill(0xffffff)
    graphic1.drawRoundedRect(
      0,
      0,
      CARD_WIDTH * scale,
      CARD_HEIGHT * scale,
      8 * scale
    )
    graphic1.endFill()
    this.spirits.cardTexture = this.render.generateTexture(graphic1)
    const graphic2 = new PIXI.Graphics()
    graphic2.lineStyle(2 * scale, 0xff0000, 1, 0)
    graphic2.beginFill(0xffffff)
    graphic2.drawRoundedRect(
      0,
      0,
      CARD_WIDTH * scale,
      CARD_HEIGHT * scale,
      8 * scale
    )
    graphic2.endFill()
    this.spirits.cardErrorTexture = this.render.generateTexture(graphic2)
    const graphic3 = new PIXI.Graphics()
    graphic3.lineStyle(2 * scale, 0xffffff, 1, 0)
    graphic3.beginFill(0xdd7c6f)
    graphic3.drawRoundedRect(
      0,
      0,
      CLOCK_WIDTH * scale,
      CLOCK_HEIGHT * scale,
      8 * scale
    )
    graphic3.endFill()
    this.spirits.clockTexture = this.render.generateTexture(graphic3)
    const graphic4 = new PIXI.Graphics()
    graphic4.lineStyle(2 * scale, 0xff0000, 1, 0)
    graphic4.beginFill(0xdd7c6f)
    graphic4.drawRoundedRect(
      0,
      0,
      CLOCK_WIDTH * scale,
      CLOCK_HEIGHT * scale,
      8 * scale
    )
    graphic4.endFill()
    this.spirits.clockTimeoutTexture = this.render.generateTexture(graphic4)
  }
  grid(num) {
    const rlt = []
    const clip = this.canvasWidth / num
    for (let i = 0; i < num; i++) {
      rlt.push({
        x: (i + 0.5) * clip - 0.5 * CARD_WIDTH,
        y: 0
      })
    }
    return rlt
  }
  init() {
    this.resultContainer = new PIXI.Container()
    this.stage.addChild(this.resultContainer)
    this.resultContainer.y = this.resultStartY
    this.resultCards = []
  }
  clear() {
    if (this.resultCards.length > 0) {
      this.resultCards.forEach(item => item.destroy())
      this.resultCards = []
    }
    this.resultContainer.children.length > 0 &&
      this.resultContainer.removeChildren(0)

    this.clock && this.clock.destroy()
  }
  createShowMap(len) {
    if (this.difficulty == 4) return {}
    const rand = []
    for (let i = 0; i < len; i++) {
      rand.push(i)
    }
    const randomNumber = function() {
      // randomNumber(a,b) 返回的值大于 0 ，则 b 在 a 的前边；
      // randomNumber(a,b) 返回的值等于 0 ，则a 、b 位置保持不变；
      // randomNumber(a,b) 返回的值小于 0 ，则 a 在 b 的前边。
      return 0.5 - Math.random()
    }
    const map = {}
    rand.sort(randomNumber)
    const showNum = len - this.difficulty
    rand.slice(0, showNum).forEach(item => {
      map[item] = true
    })
    return map
  }
  load() {
    return new Promise((resovle, reject) => {
      this.createTexture()
      this.pixiApp.loader
        .add('circle', '/images/circle.png')
        .load((loader, resources) => {
          this.spirits.circle = resources.circle.texture
          resovle()
        })
    })
  }
  createClock() {
    const bottom = new PIXI.TilingSprite(
      this.spirits.circle,
      this.canvasWidth * window.devicePixelRatio,
      CLOCK_HEIGHT / 4
    )
    bottom.tileScale.set(0.25)
    bottom.anchor.set(0.5)
    bottom.position.set(0, this.tableHeight)
    this.stage.addChild(bottom)
    this.clock = new Clock({
      time: 60,
      texture1: this.spirits.clockTexture,
      texture2: this.spirits.clockTimeoutTexture,
      x: this.canvasWidth / 2,
      y: this.tableHeight,
      width: CLOCK_WIDTH,
      height: CLOCK_HEIGHT
    })
    this.stage.addChild(this.clock.spirit)
  }
  start(word) {
    if (typeof word !== 'string' || !word) return
    this.clear()
    const words = word.split('')
    const len = words.length
    const resultClips = this.grid(len)
    const showMap = this.createShowMap(len)
    this.createClock()
    for (let i = 0; i < len; i++) {
      let fontCard = new FontCard({
        ...resultClips[i],
        name: showMap[i] ? words[i] : '',
        canChange: !showMap[i],
        answer: words[i],
        texture: this.spirits.cardTexture,
        errorTexture: this.spirits.cardErrorTexture
      })
      this.resultCards.push(fontCard)
      this.resultContainer.addChild(fontCard.spirit)
    }
    this.clock.start()
  }
}
export default IdiomGame
