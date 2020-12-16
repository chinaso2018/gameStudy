import * as PIXI from 'pixi.js'
import { TweenMax, TimelineMax, Expo, Linear } from 'gsap'
import { text } from '@fortawesome/fontawesome-svg-core'
import random from 'random'
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
/**
 * 数组打乱
 * @param {array} arr
 * @param {number} num
 */
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
class MatchCard {
  constructor({
    letter,
    row,
    col,
    x,
    y,
    width,
    height,
    texture,
    selectedTexture,
    onPointerDown,
    onPointerUp
  }) {
    this.position = { x, y }
    this.row = row
    this.col = col
    this.width = width
    this.height = height
    this.selectedTexture = selectedTexture
    this.texture = texture
    this.spirit = new PIXI.Sprite(texture)
    this.onPointerDownCallBack = onPointerDown
    this.onPointerUpCallBack = onPointerUp
    this.spirit.width = width
    this.spirit.height = height
    this.spirit.anchor.set(0.5, 0.5)
    this.spirit.position.set(x, y)
    this.originScale = this.spirit.scale.clone()
    this.letter = letter
    this.createFont()
    this.spirit.interactive = true
    this.spirit.buttonMode = true
    this.spirit
      .on('pointerdown', this.onPointerDown.bind(this))
      .on('pointerup', this.onPointerUp.bind(this))
      .on('pointerupoutside', this.onPointerUp.bind(this))
    this.isMatched = false
    this._selected = false
    //this.onMatched = onMatched
    //this.onMatching = onMatching
  }
  get visible() {
    return this.spirit.visible
  }
  set visible(value) {
    this.spirit.visible = value
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
  get selected() {
    return this._selected
  }
  set selected(value) {
    console.log('setSelected', value)
    this._selected = value
    this.spirit.texture = value ? this.selectedTexture : this.texture
  }
  createFont() {
    const font = new PIXI.Text(this.letter, {
      fontSize: (this.width / 2) * window.devicePixelRatio,
      fill: 0x333333,
      align: 'center'
    })
    font.anchor.set(0.5)
    font.position.set(0, 0)
    this.spirit.addChild(font)
  }
  onPointerUp(event) {
    typeof this.onPointerUpCallBack == 'function' &&
      this.onPointerUpCallBack(this)
  }
  onPointerDown(event) {
    if (this.selected) return
    this.data = event.data
    this.selected = true
    typeof this.onPointerDownCallBack == 'function' &&
      this.onPointerDownCallBack(this)
  }

  destroy() {
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

    const getLetter = random.binomial(25, 0.5)
    const rlt = []
    for (let i = 0; i < row; i++) {
      const line = []
      for (let j = 0; j < col; j++) {
        let randomId = getLetter() + 65
        let index = (randomId % 5) + 1
        line.push({
          row: i,
          col: j,
          x: (j + 0.5) * CARD_WIDTH,
          y: (i + 0.5) * CARD_HEIGHT,
          width: CARD_WIDTH,
          height: CARD_HEIGHT,
          texture: this.spirits['match'][`block3.png`],
          selectedTexture: this.spirits['match'][`block5.png`],
          letter: String.fromCharCode(randomId),
          show: true
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
    this.cardContainer.position.set(0, this.canvasHeight)
    this.stage.addChild(this.cardContainer)
    this.cards = []
    this.timeline = new TimelineMax()
    this.ticker.add(delta => {
      this.cardContainer.y -= delta
      if (this.cards.length > 0) {
        for (let i = 0; i < this.cards.length; i++) {
          for (let j = 0; j < this.cards[i].length; j++) {
            if (
              this.cards[i][j].visible &&
              this.cards[i][j].y + (this.cardContainer.y - CARD_HEIGHT * 0.5) <=
                0
            ) {
              this.pixiApp.stop()
              typeof this.onEnd == 'function' && this.onEnd()
            }
          }
        }
      }
    })
  }
  clear() {
    if (this.cardContainer.children.length > 0) {
      this.cardContainer.children.forEach(item => destroy())
      this.cards = []
    }
    this.matchQueue = []
    this.timeline.clear()
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
  start(difficulty) {
    this.clear()
    const _this = this
    for (let i = 0; i < this.grids.length; i++) {
      this.cards[i] = []
      for (let j = 0; j < this.grids[i].length && this.grids[i][j].show; j++) {
        let card = new MatchCard({
          ...this.grids[i][j],
          onPointerDown(currentCard) {
            _this.matchQueue.push(currentCard)
          },
          onPointerUp(currentCard) {
            _this.doMatch()
          }
        })
        this.cards[i].push(card)
        // console.log(card)
        this.cardContainer.addChild(card.spirit)
      }
    }
  }
  /**
   * 构建i行j列的动画
   * @param {*} i
   * @param {*} j
   */
  buildAnimations(i, j) {
    const animation = []
    for (let m = i - 1; m >= 0; m--) {
      //如果它是可见的
      if (this.cards[m][j].visible) {
        let flag = false,
          x = i
        for (let n = m + 1; n <= i; n++) {
          if (this.cards[n][j].visible) {
            x = n
          }
        }
      }
    }
  }
  doMatch() {
    while (this.matchQueue.length > 1) {
      const toMatchItem = this.matchQueue.shift()
      //如果匹配
      if (toMatchItem.letter == this.matchQueue[0].letter) {
        const matchedItem = this.matchQueue.shift()
        toMatchItem.visible = false
        matchedItem.visible = false
        let animations = []
        console.log(toMatchItem, matchedItem)
        if (toMatchItem.col != matchedItem.col) {
          for (let i = toMatchItem.row - 1; i >= 0; i--) {
            //console.log(this.cards[i][toMatchItem.col])
            animations.push(
              TweenMax.to(this.cards[i][toMatchItem.col], 0.2, {
                y: '+=' + toMatchItem.height
              })
            )
          }
          for (let i = matchedItem.row - 1; i >= 0; i--) {
            //console.log(this.cards[i][toMatchItem.col])
            animations.push(
              TweenMax.to(this.cards[i][matchedItem.col], 0.2, {
                y: '+=' + matchedItem.height
              })
            )
          }
        } else {
          let maxItem =
            matchedItem.row > toMatchItem.row ? matchedItem : toMatchItem
          let minItem =
            matchedItem.row > toMatchItem.row ? toMatchItem : matchedItem
          const col = matchedItem.col
          for (let i = minItem.row - 1; i >= 0; i--) {
            animations.push(
              TweenMax.to(this.cards[i][col], 0.2, {
                y: '+=' + toMatchItem.height * 2
              })
            )
          }
          for (let i = maxItem.row - 1; i > minItem.row; i--) {
            animations.push(
              TweenMax.to(this.cards[i][col], 0.2, {
                y: '+=' + toMatchItem.height
              })
            )
          }
        }

        this.timeline.add(animations)
      } else {
        toMatchItem.selected = false
        //如果只剩最后一个，则清掉匹配队列
        if (this.matchQueue.length == 1) {
          this.matchQueue[0].selected = false
          this.matchQueue.shift()
        }
      }
    }
  }

  isComplete() {
    //return this.resultCards.every(item => !canChange)
  }
  tryComplete() {
    // if (this.isComplete()) {
    //   this.clock.stop()
    //   typeof this.onEnd == 'function' && this.onEnd()
    // }
  }
  /**
   * 获取提示
   */
  getTip() {}
}
export default MatchGame
