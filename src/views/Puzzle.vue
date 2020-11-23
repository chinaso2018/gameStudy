<template>
  <div class="container">
    <div class="header">
      <font-awesome-icon
        icon="arrow-alt-circle-left"
        class="backButton"
        @click="goBack"
      />
      <div class="headerRight" v-show="status == 1">
        <font-awesome-icon
          icon="question-circle"
          class="backButton mR20"
          @click="gameTip"
        />
        <div class="circle">
          <font-awesome-icon icon="undo-alt" class="icon" @click="newGame" />
        </div>
      </div>
    </div>
    <canvas
      class="myCanvas"
      id="canvasDom"
      :style="{ height: canvasHeight + 'px', width: canvasWidth + 'px' }"
    />
    <div
      class="mask"
      :class="{ fadeIn: status == 2 || status == 3 }"
      :style="{ height: canvasHeight + 'px', width: canvasWidth + 'px' }"
      v-if="showModal"
    >
      <div v-if="status == 0" class="loading">加载中...</div>
      <div v-if="status == 2" class="loading">游戏结束</div>
      <div v-if="status == 3" class="loading">游戏超时</div>
      <div v-if="status == 2 || status == 3" class="endButtons">
        <CButton text="首页" @onClick="goBack" />
        <CButton text="新游戏" @onClick="newGame" />
      </div>
    </div>
  </div>
</template>

<script>
import Game from '@/assets/structure/idiom'
import CButton from '@/components/CButton'
export default {
  components: { CButton },
  name: 'Puzzle',
  data() {
    return {
      canvasHeight: 0,
      canvasWidth: 0,
      list: ['一心一意', '三心二意', '守株待兔'],
      index: 0,
      status: 0 //0 准备 1 开始 2 结束 3超时
    }
  },
  computed: {
    showModal() {
      return this.status == 0 || this.status == 2 || this.status == 3
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
    this.init()
  },
  methods: {
    gameTip() {
      this.game && this.game.getTip()
    },
    newGame() {
      this.index = (this.index + 1) % this.list.length
      this.game.start(this.list[this.index])
      this.status = 1
    },
    goBack() {
      this.$router.go(-1)
    },
    init() {
      const canvasDom = document.getElementById('canvasDom')
      this.game = new Game({
        canvas: canvasDom,
        canvasHeight: this.canvasHeight,
        canvasWidth: this.canvasWidth,
        difficulty: this.$route.query['d']||2,
        onTimeout: () => {
          this.status = 3
        },
        onEnd: () => {
          this.status = 2
        }
      })
      this.game.load().then(() => {
        this.game.start(this.list[this.index])
        this.status = 1
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
.fadeIn{
  animation: fadeInAnimation 250ms;
}
@keyframes fadeInAnimation {
  from{
    opacity:0 ;
  }
  to{
    opacity: 1;
  }
}
</style>
