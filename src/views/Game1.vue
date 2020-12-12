<template>
  <div class="home">
    <div class="cloud x1"></div>
    <div class="cloud x2"></div>
    <div class="cloud x3"></div>
    <div class="logoContainer">
      <img class="logo pushReleaseFrom" src="/images/logo.png" />
    </div>
    <div class="bottom">
      <div
        class="playButton pepe"
        :class="{ active: isActive }"
        @touchstart="pressIn"
        @mousedown="pressIn"
        @mouseup="pressOut"
        @touchend="pressOut"
      >
        <img src="/images/playgame.png" class="playIcon" />
      </div>
    </div>
    <div class="mask fadeIn" v-show="chooseOption">
        <div class="options">
          <CButton text="简单"  @onClick="goPuzzle(1)"/>
          <CButton text="普通"  @onClick="goPuzzle(2)"/>
          <CButton text="困难"  @onClick="goPuzzle(3)"/>
          <CButton text="变态"  @onClick="goPuzzle(4)"/>
        </div>
    </div>
  </div>
</template>

<script>
import CButton from '@/components/CButton'
export default {
  components:{CButton},
  name: 'Home',
  data () {
    return {
      isActive: false,
      chooseOption:false
    }
  },
  methods: {
    pressIn () {
      this.isActive = true
    },
    pressOut () {
      this.isActive = false
      this.chooseOption = true
    },
    goPuzzle(difficulty){
      this.$router.push({ path: '/idiom/game?d='+difficulty })
    }
  }
}
</script>
<style scoped>
.home {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  background-image: url('../assets/back3.jpeg');
  background-size:100% 100%;
  background-repeat: no-repeat;
}
.logoContainer {
  width: 100%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.playIcon {
  width: 80%;
  height: auto;
}
.logo {
  width: 80%;
  height: auto;
  margin: 0 auto;
  display: block;
}
.bottom {
  position: fixed;
  bottom: 50px;
  width: 100%;
}
.playButton {
  width: 200px;
  height: 80px;
  background-color: #6aa1ec;
  border-radius: 40px;
  animation: pepe 2s ease-in-out infinite;
  margin: 0 auto;
  filter: drop-shadow(8px 8px 10px rgba(0, 0, 0, 0.3));
  display: flex;
  justify-content: center;
  align-items: center;
}
.playButton.active {
  animation: none;
  transform: scale(0.8);
}
.cloud {
  width: 200px;
  height: 60px;
  background: #fff;
  border-radius: 200px;
  -moz-border-radius: 200px;
  -webkit-border-radius: 200px;
  position: absolute;
}
.cloud:before,
.cloud:after {
  content: '';
  position: absolute;
  background: #fff;
  width: 100px;
  height: 80px;
  position: absolute;
  top: -15px;
  left: 10px;
  border-radius: 100px;
  -moz-border-radius: 100px;
  -webkit-border-radius: 100px;
  -webkit-transform: rotate(30deg);
  transform: rotate(30deg);
  -moz-transform: rotate(30deg);
}
.cloud:after {
  width: 120px;
  height: 120px;
  top: -55px;
  left: auto;
  right: 15px;
}
.x1 {
  opacity: 0.8;
  top: 0;
  animation: moveclouds 10s linear both alternate infinite;
}
.x2 {
  top: 100px;
  transform: scale(0.6);
  opacity: 0.6;
  animation: moveclouds 15s linear both alternate infinite;
}
.x3 {
  top: 150px;
  transform: scale(0.8);
  opacity: 0.9;
  animation: moveclouds 20s linear both alternate infinite;
}
@keyframes moveclouds {
  0% {
    left: -200px;
  }
  100% {
    left: 500px;
  }
}
.pushReleaseFrom {
  animation: pushReleaseFrom 2s 0.2s both ease-in-out;
}
@keyframes pushReleaseFrom {
  from {
    transform: scale(3, 3);
    opacity: 0;
  }
  30% {
    transform: scale(0.5, 0.5);
  }
}
.hu__hu__ {
  animation: hu__hu__ infinite 2s ease-in-out;
}
@keyframes hu__hu__ {
  50% {
    transform: translateY(30px);
  }
}

@keyframes pepe {
  from,
  33%,
  66%,
  to {
    transform: rotate(4deg);
  }
  16%,
  50%,
  83% {
    transform: rotate(-4deg);
  }
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
.mask {
  position: fixed;
  z-index: 9;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.7);
}
.options{
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  width:80%;
  height:60%;
  background: #ececec;
  border-radius: 14px;
}
</style>
