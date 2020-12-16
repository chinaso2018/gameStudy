<template>
  <div class="container">
    <div class="header">
      <font-awesome-icon
        icon="arrow-alt-circle-left"
        class="backButton"
        @click="goBack"
      />
      <div class="headerRight" v-show="status == 2">
        <font-awesome-icon
          icon="question-circle"
          class="backButton mR20"
          @click="gameTip"
        />
        <div class="circle">
          <font-awesome-icon
            icon="undo-alt"
            class="icon"
            @click="resetCurrentStage"
          />
        </div>
      </div>
    </div>
    <canvas
      class="myCanvas"
      id="canvasDom"
      :style="{ height: canvasHeight + 'px', width: canvasWidth + 'px' }"
    />
    <div class="start" v-show="status == 0">
      <section>
        <header class="gameName">消消乐</header>
        <p class="gameMemo">游戏说明：<br/>1.选择相同的字母来清除<br/>2.不要碰到最上端<br/>3.清除所有方块</p>
        <CButton text="开始游戏" @onClick="init" />
      </section>
    </div>
    <div
      class="mask"
      :class="{ fadeIn: status == 3 || status == 4 }"
      :style="{ height: canvasHeight + 'px', width: canvasWidth + 'px' }"
      v-if="showModal"
    >
      <div v-if="status == 1" class="loading">加载中...</div>
      <div v-if="status == 3" class="loading">游戏结束</div>
      <div v-if="status == 4" class="loading">游戏失败</div>
      <div v-if="status == 3 || status == 4" class="endButtons">
        <CButton text="首页" @onClick="goBack" />
        <CButton text="新游戏" @onClick="newGame" />
      </div>
    </div>
  </div>
</template>

<script>
import Game from '@/assets/structure/match'
import CButton from '@/components/CButton'
export default {
  components: { CButton },
  name: 'Game2',
  data() {
    return {
      canvasHeight: 0,
      canvasWidth: 0,
      index: 0,
      level: 1, //第几关
      status: 0 //0 准备 1 加载中 2 进行中 3成功 4失败
    }
  },
  computed: {
    showModal() {
      return this.status == 1 || this.status == 3 || this.status == 4
    }
  },
  beforeMount() {
    const windowHeight =
      document.documentElement.clientHeight || document.body.clientHeight
    const windowWidth =
      document.documentElement.clientWidth || document.body.clientWidth
    this.canvasHeight = windowHeight - 50
    this.canvasWidth = windowWidth
  },
  mounted() {
    //this.init()
  },
  methods: {
    gameTip() {
      this.game && this.game.getTip()
    },
    resetCurrentStage() {},
    newGame(){},
    goBack() {
      this.$router.go(-1)
    },
    init() {
      this.status = 1
      const canvasDom = document.getElementById('canvasDom')
      this.game = new Game({
        canvas: canvasDom,
        canvasHeight: this.canvasHeight,
        canvasWidth: this.canvasWidth,
        onFail: () => {
          this.status = 4
        },
        onEnd: () => {
          this.status = 3
        }
      })
      this.game.load().then(() => {
        //this.game.start(this.list[this.index])
        this.status = 2
        this.game.start()
      })
    }
  }
}
</script>
<style scoped>
.container {
  width: 100%;
  height: 100%;
  overflow: hidden;
  background:#EDEDED;
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
  z-index: 1;
}
.start {
  position: fixed;
  top: 50px;
  left: 0;
  right:0;
  bottom: 0;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top:10vh;
}
.mask {
  position: fixed;
  top: 50px;
  left: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.7);
  z-index: 99;
}
.endButtons {
  display: flex;
  flex-direction: row;
  width: 80%;
  justify-content: space-between;
  align-items: center;
}
.loading {
  color: #ffffff;
  font-size: 30px;
  font-weight: bold;
  margin-bottom: 30px;
}
.fadeIn {
  animation: fadeInAnimation 250ms;
}
@keyframes fadeInAnimation {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
.start>section{
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}
.gameName{
  color:#CE695D;
  font-size: 3em;
  text-shadow: 3px -3px 0px #D9D9D9;
  margin-bottom: 5vh;
}
.gameMemo{
  text-align: left;
  padding:0 16px;
  font-size: 1em;
  line-height: 2em;
  margin-bottom: 5vh;
}

</style>
