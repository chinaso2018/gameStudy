import * as PIXI from 'pixi.js'
import { TweenMax, TimelineMax, Expo, Linear } from 'gsap'
const CARD_WIDTH = 50
const CARD_HEIGHT = 50
const CLOCK_WIDTH = 100
const CLOCK_HEIGHT = 50
const arrayShuffle = (arr, num = 1) => {
  const randomNumber = function() {
    // randomNumber(a,b) 返回的值大于 0 ，则 b 在 a 的前边；
    // randomNumber(a,b) 返回的值等于 0 ，则a 、b 位置保持不变；
    // randomNumber(a,b) 返回的值小于 0 ，则 a 在 b 的前边。
    return 0.5 - Math.random()
  }
  for (let i = 0; i < num; i++) {
    arr.sort(randomNumber)
  }
  return arr
}
function getRandom(min, max) {
  return min + Math.random() * (max - min)
}
class FontCard {
  constructor({ name, x, y, texture, activeTexture, answer, canChange }) {
    this.texture = texture
    this.position = { x: x, y: y }
    this.activeTexture = activeTexture
    this.spirit = new PIXI.Sprite(texture)
    this.spirit.width = CARD_WIDTH
    this.spirit.height = CARD_HEIGHT
    this.spirit.anchor.set(0.5)
    this.spirit.position.set(x, y)
    this._active = false
    this._name = ''
    this.name = name
    this.answer = answer
    this.canChange = canChange
    if (!this.canChange) {
      this.createFont(this.answer)
    }
  }
  get match() {
    return this.name == this.answer
  }
  set match(value) {
    if (value) {
      this.name = this.answer
      this.canChange = false
    }
  }
  createFont(value) {
    if (this.font) {
      this.font.text = value
      return
    }
    this.font = new PIXI.Text(value, {
      fontSize: (CARD_WIDTH / 2) * window.devicePixelRatio,
      fill: 0x333333,
      align: 'center'
    })
    this.font.anchor.set(0.5)
    this.font.position.set(0, 0)
    this.spirit.addChild(this.font)
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
        this.createFont(value)
      }

      this._name = value
    }
  }
  get active() {
    return this._active
  }
  set active(value) {
    if (!this.canChange) return
    value = !!value
    if (value != this._active) {
      this.spirit.texture = value ? this.activeTexture : this.texture
    }
    this._active = value
  }
  destroy() {
    this.spirit.destroy()
  }
}
class MatchCard {
  constructor({ name, x, y, texture, onMatched, onMatching }) {
    this.texture = texture
    this.position = { x, y }
    this.spirit = new PIXI.Sprite(texture)
    this.spirit.width = CARD_WIDTH
    this.spirit.height = CARD_HEIGHT
    this.spirit.anchor.set(0.5)
    this.spirit.position.set(x, y)
    this.name = name
    this.createFont(this.name)
    this.spirit.interactive = true
    this.spirit.buttonMode = true
    this.spirit
      .on('pointerdown', this.onDragStart.bind(this))
      .on('pointerup', this.onDragEnd.bind(this))
      .on('pointerupoutside', this.onDragEnd.bind(this))
      .on('pointermove', this.onDragMove.bind(this))
    this.isMatched = false
    this.onMatched = onMatched
    this.onMatching = onMatching
  }
  get x() {
    return this.position.x
  }
  get y() {
    return this.position.y
  }
  set x(value) {
    this.position.x = value
    this.spirit.x = value
  }
  set y(value) {
    this.position.y = value
    this.spirit.y = value
  }
  createFont(value) {
    const font = new PIXI.Text(value, {
      fontSize: (CARD_WIDTH / 2) * window.devicePixelRatio,
      fill: 0x333333,
      align: 'center'
    })
    font.anchor.set(0.5)
    font.position.set(0, 0)
    this.spirit.addChild(font)
  }
  onDragStart(event) {
    this.data = event.data
    this.spirit.alpha = 0.8
    this.dragging = true
  }
  onDragEnd() {
    this.dragging = false
    this.spirit.alpha = 1

    if (this.isMatched) {
      this.spirit.visible = false
    } else {
      TweenMax.to(this.spirit, 0.3, { x: this.position.x, y: this.position.y })
    }
    typeof this.onMatched == 'function' && this.onMatched(this.isMatched)
    this.data = null
  }
  onDragMove() {
    if (this.dragging) {
      const newPosition = this.data.getLocalPosition(this.spirit.parent)
      this.spirit.position.set(newPosition.x, newPosition.y)
      if (typeof this.onMatching == 'function') {
        this.isMatched = this.onMatching(this.data.global, this.name)
      }
    }
  }

  destroy() {
    this.spirit.destroy()
  }
}
class Clock {
  /**
   *
   * @param {number} time 总计时 单位：秒
   */
  constructor({ time, texture1, texture2, x, y, width, height, onTimeout }) {
    this.time = time * 1000
    this.position = { x, y }
    this.texture1 = texture1
    this.texture2 = texture2
    this.onTimeout = onTimeout
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
      typeof this.onTimeout == 'function' && this.onTimeout()
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
  constructor({
    canvas,
    canvasWidth,
    canvasHeight,
    difficulty,
    onEnd,
    onTimeout,
    onStart
  }) {
    this.canvas = canvas
    this.canvasWidth = canvasWidth
    this.canvasHeight = canvasHeight
    this.onEnd = onEnd
    this.onTimeout = onTimeout
    this.onStart = onStart
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
    this.timeout = difficulty * 60
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
  createLine(num, y = 0) {
    const rlt = []
    const clip = this.canvasWidth / num
    for (let i = 0; i < num; i++) {
      rlt.push({
        x: (i + 0.5) * clip,
        y: y
      })
    }
    return rlt
  }
  /**
   * 创建网格
   * @param {*} row
   * @param {*} col
   */
  createGrid(row, col) {
    const rlt = []
    for (let i = 0; i < row; i++) {
      rlt.push(this.createLine(col, i * (CARD_HEIGHT + 20)))
    }
    return rlt
  }
  init() {
    this.resultContainer = new PIXI.Container()
    this.matchContainer = new PIXI.Container()
    this.starContainer = new PIXI.Container()
    this.stage.addChild(this.resultContainer)
    this.stage.addChild(this.matchContainer)
    this.stage.addChild(this.starContainer)
    this.resultContainer.y = this.resultStartY
    this.matchContainer.y = this.tableHeight + CLOCK_HEIGHT + 20
    this.resultCards = []
    this.matchCards = []
  }
  clear() {
    this.timeline && this.timeline.kill()
    if (this.resultCards.length > 0) {
      this.resultCards.forEach(item => item.destroy())
      this.resultCards = []
    }
    this.resultContainer.children.length > 0 &&
      this.resultContainer.removeChildren(0)

    if (this.matchCards.length > 0) {
      this.matchCards.forEach(item => item.destroy())
      this.matchCards = []
    }
    this.matchContainer.children.length > 0 &&
      this.matchContainer.removeChildren(0)

    this.clock && this.clock.destroy()
    this.starContainer.visible = false
  }
  createHearts() {
    this.starts = []
    const HEARTS_NUM = 10
    const SIZE = 50
    for (let i = 0; i < HEARTS_NUM; i++) {
      const starSpirit = new PIXI.Sprite(this.spirits.heart)
      const scale = getRandom(0.1, 0.8)
      const length = Math.random() * (SIZE / 2 - (SIZE * scale) / 2)
      const angle = Math.random() * Math.PI * 2
      starSpirit.scale.set(scale)
      starSpirit.anchor.set(0.5)
      const x = Math.cos(angle) * length
      const y = Math.sin(angle) * length
      starSpirit.position.set(x, y)
      starSpirit.alpha = 1

      this.starts.push({
        from: { x: x, y: y },
        spirit: starSpirit,
        to: { x: Math.cos(angle) * length * 6, y: Math.sin(angle) * length * 6 }
      })
      this.starContainer.addChild(starSpirit)
    }
  }
  createShowMap(len) {
    if (this.difficulty == 4) return {}
    let rand = []
    for (let i = 0; i < len; i++) {
      rand.push(i)
    }
    const map = {}
    rand = arrayShuffle(rand, 2)
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
        .add('heart', '/images/heart.png')
        .load((loader, resources) => {
          this.spirits.circle = resources.circle.texture
          this.spirits.heart = resources.heart.texture
          this.createHearts()
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
      time: this.timeout,
      texture1: this.spirits.clockTexture,
      texture2: this.spirits.clockTimeoutTexture,
      x: this.canvasWidth / 2,
      y: this.tableHeight,
      width: CLOCK_WIDTH,
      height: CLOCK_HEIGHT,
      onTimeout: () => {
        typeof this.onTimeout == 'function' && this.onTimeout()
      }
    })
    this.stage.addChild(this.clock.spirit)
  }
  getRandomWords() {
    let randomWords = [
      '好',
      '好',
      '好',
      '好',
      '好',
      '好',
      '好',
      '好',
      '好',
      '好',
      '好',
      '好'
    ]
    randomWords = randomWords.slice(0, 12 - this.difficulty)
    return randomWords
  }
  start(word) {
    if (typeof word !== 'string' || !word) return
    this.clear()
    //创建时钟
    this.createClock()
    //获取随机汉字
    let randomWords = this.getRandomWords()

    //创建题目
    const words = word.split('')
    const len = words.length
    const resultClips = this.createLine(len)
    const showMap = this.createShowMap(len)

    for (let i = 0; i < len; i++) {
      if (!showMap[i]) {
        randomWords.push(words[i])
      }
      let fontCard = new FontCard({
        ...resultClips[i],
        name: showMap[i] ? words[i] : '',
        canChange: !showMap[i],
        answer: words[i],
        texture: this.spirits.cardTexture,
        activeTexture: this.spirits.cardErrorTexture
      })
      this.resultCards.push(fontCard)
      this.resultContainer.addChild(fontCard.spirit)
    }
    //创建答案
    const matchGrids = this.createGrid(3, 4)
    const fromPositions = this.getFirstPostions(randomWords.length)
    randomWords = arrayShuffle(randomWords, 3)
    for (let i = 0; i < randomWords.length; i++) {
      let matchCard = new MatchCard({
        ...fromPositions[i],
        name: randomWords[i],
        texture: this.spirits.cardTexture,
        onMatching: (centerPoint, name) => {
          const activeItem = this.resultCards.filter(item => item.canChange)
          let flag = false
          if (activeItem.length > 0) {
            for (let i = 0; i < activeItem.length; i++) {
              if (
                activeItem[i].spirit
                  .getBounds()
                  .contains(centerPoint.x, centerPoint.y)
              ) {
                activeItem[i].active = true
                this.activeResult = activeItem[i]
                if (activeItem[i].answer == name) {
                  flag = true
                }
              } else {
                activeItem[i].active = false
              }
            }
          }
          return flag
        },
        onMatched: matched => {
          if (this.activeResult) {
            this.activeResult.active = false
            if (matched) {
              this.activeResult.match = true
              //心形动画
              const bounds = this.activeResult.spirit.getBounds()
              this.doHeartAnimation(bounds).then(() => {
                this.tryComplete()
              })
            }
          }
        }
      })
      this.matchCards.push(matchCard)
      this.matchContainer.addChild(matchCard.spirit)
    }
    //创建开始动画
    this.timeline = new TimelineMax()
    this.timeline.staggerTo(
      this.matchCards,
      0.5,
      {
        x: function(index) {
          return matchGrids[Math.floor(index / 4)][index % 4].x
        },
        y: function(index) {
          return matchGrids[Math.floor(index / 4)][index % 4].y
        }
      },
      0.2,
      '+=0',
      () => {
        //开始计时
        this.clock.start()
      }
    )
  }
  doHeartAnimation(bounds) {
    this.starContainer.position.set(
      bounds.x + bounds.width / 2,
      bounds.y + bounds.height / 2
    )
    this.starContainer.visible = true
    const spirits = this.starts.map(item => item.spirit)
    return new Promise((resolve, reject) => {
      TweenMax.set(spirits, {
        alpha: 1,
        onComplete: () => {
          TweenMax.to(spirits, 0.8 + Math.random(), {
            alpha: 0,
            x: index => {
              return this.starts[index].to.x
            },
            y: index => {
              return this.starts[index].to.y
            },
            onComplete: () => {
              TweenMax.set(spirits, {
                x: index => {
                  return this.starts[index].from.x
                },
                y: index => {
                  return this.starts[index].from.y
                },
                onComplete: resolve
              })
            }
          })
        }
      })
    })
  }
  getFirstPostions(len) {
    const y = 3 * (CARD_HEIGHT + 20)
    const centerX = this.canvasWidth / 2
    const middle = (len - 1) / 2
    const middleIndex = Math.floor(middle)
    const rlt = []
    for (let i = 0; i < middle; i++) {
      rlt.push({
        x: centerX - (middle - i) * 5,
        y: y
      })
    }
    if (middle % 1 == 0) {
      rlt.push({
        x: centerX,
        y: y
      })
    }
    for (let i = middleIndex + 1; i < len; i++) {
      rlt.push({
        x: centerX + (i - middle) * 5,
        y: y
      })
    }
    return rlt
  }
  isComplete() {
    return this.resultCards.every(item => !item.canChange)
  }
  tryComplete() {
    if (this.isComplete()) {
      this.clock.stop()
      typeof this.onEnd == 'function' && this.onEnd()
    }
  }
  /**
   * 获取提示
   */
  getTip() {
    const answerCard = this.resultCards.find(item => item.canChange)
    if (!answerCard) return
    const answer = answerCard.answer
    const matchCard = this.matchCards.find(item => item.name == answer)
    if (!matchCard) return
    TweenMax.to(matchCard.spirit.scale, 0.2, {
      x: 1.05,
      y: 1.05,
      repeat: 1,
      yoyo: true
    })
  }
}
export default IdiomGame
