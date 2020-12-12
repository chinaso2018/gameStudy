import * as PIXI from 'pixi.js'
import { TweenMax, TimelineMax, Expo, Linear } from 'gsap'
import { text } from '@fortawesome/fontawesome-svg-core'
let CARD_WIDTH = 50
let CARD_HEIGHT = 50
const GAME_COL = 5
/**
 * 矩形和矩形的碰撞检测
 * @param {*} r1
 * @param {*} r2
 */
function hitTestRectangle(r1, r2) {
  //Define the variables we'll need to calculate
  let hit, combinedHalfWidths, combinedHalfHeights, vx, vy

  //hit will determine whether there's a collision
  hit = false

  //Find the center points of each sprite
  r1.centerX = r1.x + r1.width / 2
  r1.centerY = r1.y + r1.height / 2
  r2.centerX = r2.x + r2.width / 2
  r2.centerY = r2.y + r2.height / 2

  //Find the half-widths and half-heights of each sprite
  r1.halfWidth = r1.width / 2
  r1.halfHeight = r1.height / 2
  r2.halfWidth = r2.width / 2
  r2.halfHeight = r2.height / 2

  //Calculate the distance vector between the sprites
  vx = r1.centerX - r2.centerX
  vy = r1.centerY - r2.centerY

  //Figure out the combined half-widths and half-heights
  combinedHalfWidths = r1.halfWidth + r2.halfWidth
  combinedHalfHeights = r1.halfHeight + r2.halfHeight

  //Check for a collision on the x axis
  if (Math.abs(vx) < combinedHalfWidths) {
    //A collision might be occurring. Check for a collision on the y axis
    if (Math.abs(vy) < combinedHalfHeights) {
      //There's definitely a collision happening
      hit = true
    } else {
      //There's no collision on the y axis
      hit = false
    }
  } else {
    //There's no collision on the x axis
    hit = false
  }

  //`hit` will be either `true` or `false`
  return hit
}
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
  constructor({ time, texture1, texture2, x, y, width, height, onFail }) {
    this.time = time * 1000
    this.position = { x, y }
    this.texture1 = texture1
    this.texture2 = texture2
    this.onFail = onFail
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
      typeof this.onFail == 'function' && this.onFail()
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
class MatchGame {
  constructor({
    canvas,
    canvasWidth,
    canvasHeight,
    level,
    onEnd,
    onFail,
    onStart
  }) {
    this.canvas = canvas
    this.canvasWidth = canvasWidth
    this.canvasHeight = canvasHeight
    this.onEnd = onEnd
    this.onFail = onFail
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
    this.speed = level || 1
    this.spirits = {}
  }
  // setup() {
  //   //Initialize the game sprites, set the game `state` to `play`
  //   //and start the 'gameLoop'
  // }

  // gameLoop(delta) {
  //   //Runs the current game `state` in a loop and renders the sprites
  // }

  // play(delta) {
  //   //All the game logic goes here
  // }

  // end() {
  //   //All the code that should run at the end of the game
  // }

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
   * @param {*} col 一行的列数
   */
  createGrid(col) {
    //设定卡片宽度和高度
    CARD_HEIGHT = CARD_WIDTH = this.canvasWidth / col
    //
    const row = Math.floor(this.canvasHeight / CARD_HEIGHT) * 2

    const rlt = []
    for (let i = 0; i < row; i++) {
      const line = []
      for (let j = 0; j < col; j++) {
        let index = ((i * row + j) % 5) + 1
        line.push({
          x: (j + 0.5) * CARD_WIDTH,
          y: i * CARD_HEIGHT,
          width: CARD_WIDTH,
          height: CARD_HEIGHT,
          texture: this.spirits['match'][`block${index}.png`]
        })
      }
      rlt.push(line)
    }
    return rlt
  }
  gameLoop(delta) {
    //Runs the current game `state` in a loop and renders the sprites
  }
  play(delta) {
    //All the game logic goes here
  }
  setup() {
    this.createBackground(this.spirits['match']['matchtile.png'])
    this.grids = this.createGrid(GAME_COL)
    this.cardContainer = new PIXI.Container()
    this.stage.addChild(this.resultContainer)
    this.cards = []
    console.log(this.grids)
  }
  clear() {
    if (this.cards.length > 0) {
      this.cards.forEach(item => item.destroy())
      this.cards = []
    }
  }
  load() {
    return new Promise((resovle, reject) => {
      this.pixiApp.loader
        .add('match', '/images/match.json')
        .load((loader, resources) => {
          this.spirits['match'] = resources['match'].textures
          this.setup()
          resovle()
        })
    })
  }
  /**
   * 创建背景
   */
  createBackground(texture) {
    const backSpirit = new PIXI.TilingSprite(
      texture,
      this.canvasWidth,
      this.canvasHeight
    )
    this.stage.addChild(backSpirit)
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
  start(level) {
    if (typeof word !== 'string' || !word) return
    this.clear()
    const rows = this.grids.length
    const cols = this.grids[0].length
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        let index = ((i * cols + j) % 5) + 1
        this.cards.push({
          ...this.grids[i][j]
        })
      }
    }
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
  getTip() {}
}
export default MatchGame
