<template>
  <div class="container">
    <div class="header">
      <font-awesome-icon icon="arrow-alt-circle-left" class="backButton" />
      <div class="headerRight">
        <font-awesome-icon icon="question-circle" class="backButton mR20" />
        <div class="circle">
          <font-awesome-icon icon="undo-alt" class="icon" />
        </div>
      </div>
    </div>
    <canvas
      class="myCanvas"
      id="canvasDom"
      :style="{ height: canvasHeight + 'px' }"
    />
  </div>
</template>

<script>
import * as PIXI from 'pixi.js'
export default {
  name: 'Puzzle',
  data () {
    return {
      canvasHeight: 0,
      canvasWidth: 0
    }
  },
  beforeMount () {
    const windowHeight =
      document.documentElement.clientHeight || document.body.clientHeight
    const windowWidth =
      document.documentElement.clientWidth || document.body.clientWidth
    this.canvasHeight = windowHeight - 50
    this.canvasWidth = windowWidth
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      const canvasDom = document.getElementById('canvasDom')
      this.pixiApp = new PIXI.Application({
        view: canvasDom,
        antialias: true,
        backgroundColor: 0x75a2e6,
        resolution: window.devicePixelRatio,
        width:this.canvasWidth,
        height:this.canvasHeight
      })
      const graphics = new PIXI.Graphics()

      // Rectangle
      graphics.beginFill(0xde3249)
      graphics.drawRect(50, 50, 100, 100)
      graphics.endFill()
      this.pixiApp.stage.addChild(graphics)
    }
  }
}
</script>
<style scoped>
.container {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.icon {
  color: #ffffff;
  width: 25px;
  height: 25px;
}
.mR20 {
  margin-right: 20px;
}
.circle {
  width: 45px;
  height: 45px;
  border-radius: 100%;
  background-color: rgb(117, 162, 230);
  display: flex;
  justify-content: center;
  align-items: center;
}
.header {
  position: fixed;
  top: 0;
  width: 100%;
  height: 50px;
  background: #ffffff;
  box-shadow: 0 2px 10px 0px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
}
.headerRight {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
.backButton {
  color: rgb(117, 162, 230);
  width: 45px;
  height: 45px;
}
.myCanvas {
  position: absolute;
  top: 50px;
  left: 0;
  width: 100%;
}
</style>
