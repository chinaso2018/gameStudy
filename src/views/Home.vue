<template>
  <ul class="container">
    <li><router-link to="/idiom">成语游戏</router-link></li>
    <li><router-link to="/match">消消乐游戏</router-link></li>
  </ul>
</template>
<style scoped>
.container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: center;
}
.container>li>a{
  display: block;
  width:100%;
  height:10vh;
  text-align: center;
  text-decoration: none;
  font-size: 5vh;
  line-height: 10vh;
  color:aliceblue;
  text-shadow: 2px 2px 2px #333333;
}
</style>
