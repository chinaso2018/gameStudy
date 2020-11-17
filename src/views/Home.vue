<template>
  <div class="home">
    <div class="cloud x1"></div>
    <div class="cloud x2"></div>
    <div class="cloud x3"></div>
    <div class="logoContainer">
      <img class="logo pushReleaseFrom" src="/images/logo.png" />
    </div>
    <div class="bottom">
      <div class="playButton pepe">
        <img src="/images/playgame.png" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Home'
}
</script>
<style scoped>
.home {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
}
.logoContainer {
  width: 100%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
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
  background: #ffffff;
  border-radius: 100px;
  animation:  pepe 2s ease-in-out infinite;
  margin: 0 auto;
  filter: drop-shadow(8px 8px 10px rgba(0, 0, 0, 0.3));
  color: #333333;
  font-size: 30px;
  line-height: 80px;
  text-align: center;
  color: #1144aa;
  display: flex;
  justify-content: center;
  align-items: center;
}
.playButton:after,
.playButton:before {
  content: '';
  position: absolute;
  background: #ffffff;
  z-index: -1;
}
.playButton:after {
  width: 60px;
  height: 64px;
  top: -23px;
  left: 26px;
  border-radius: 40px;
}
.playButton:before {
  width: 118px;
  height: 114px;
  top: -40px;
  left: 64px;
  border-radius: 98px;
}
.shadow {
  width: 350px;
  position: absolute;
  bottom: -25px;
  background: #000;
  -webkit-animation: scalex 3s ease-in-out infinite;
  animation: scalex 3s ease-in-out infinite;
  box-shadow: 0 0 25px 8px rgba(0, 0, 0, 0.4);
}
@-webkit-keyframes Floating {
  from {
    -moz-transform: translate(0, 0px);
  }
  65% {
    -moz-transform: translate(0, 15px);
  }
  to {
    -moz-transform: translate(0, 0px);
  }
}
@keyframes Floating {
  from {
    -moz-transform: translate(0, 0px);
  }
  65% {
    -moz-transform: translate(0, 15px);
  }
  to {
    -moz-transform: translate(0, 0px);
  }
}
@-webkit-keyframes Floatingx {
  from {
    -webkit-transform: translate(0, 0px);
  }
  65% {
    -webkit-transform: translate(0, 15px);
  }
  to {
    -webkit-transform: translate(0, 0px);
  }
}
@-webkit-keyframes scalex {
  from {
    -webkit-transform: scale(0.9);
  }
  65% {
    -webkit-transform: scale(1);
  }
  to {
    -webkit-transform: scale(0.9);
  }
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
.pushReleaseFrom { animation: pushReleaseFrom 2s 0.5s ease-in-out;}
@keyframes pushReleaseFrom {
    from {
        transform: scale(3, 3);
        opacity: 0;
    }
    30% { transform: scale(.5, .5) }
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
</style>
