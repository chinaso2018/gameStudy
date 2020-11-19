<template>
  <div class="container">
    <div class="header">
      <font-awesome-icon icon="arrow-alt-circle-left" class="backButton" @click="goBack"/>
      <div class="headerRight" v-show="!isLoading">
        <font-awesome-icon icon="question-circle" class="backButton mR20" @click="gameTip"/>
        <div class="circle">
          <font-awesome-icon icon="undo-alt" class="icon"  @click="newGame"/>
        </div>
      </div>
    </div>
    <canvas
      class="myCanvas"
      id="canvasDom"
      :style="{ height: canvasHeight + 'px',width:canvasWidth+'px' }"
    />
    <div v-show="isLoading" class="loading">加载中...</div>
  </div>
</template>

<script>
import Game from '@/assets/structure/idiom'
export default {
  name: 'Puzzle',
  data() {
    return {
      canvasHeight: 0,
      canvasWidth: 0,
      list:['一心一意','三心二意','守株待兔'],
      index:0,
      isLoading:true
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
    gameTip(){

    },
    newGame(){
      this.index = (this.index+1)%this.list.length
      this.game.start(this.list[this.index])
    },
    goBack(){
      this.$router.go(-1)
    },
    init() {
      const canvasDom = document.getElementById('canvasDom')
      this.game = new Game({
        canvas:canvasDom,
        canvasHeight:this.canvasHeight,
        canvasWidth:this.canvasWidth,
        difficulty:2
      })
      this.game.load().then(()=>{
        this.isLoading = false
        this.game.start(this.list[this.index])
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
.loading{
  position: absolute;
  top:50%;
  left:50%;
  transform: translate(-50%,-50%);
  color:#ffffff;
  font-size: 40px;
  font-weight: bold;
}
</style>
