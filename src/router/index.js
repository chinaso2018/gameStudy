import Vue from 'vue'
import VueRouter from 'vue-router'
import Game1 from '../views/Game1.vue'
import Game2 from '../views/Game2.vue'
import Puzzle from '../views/Puzzle.vue'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/idiom',
    name: 'Game1',
    component: Game1
  },
  {
    path: '/match',
    name: 'Game2',
    component: Game2
  },
  {
    path: '/idiom/game',
    name: 'Puzzle',
    component: Puzzle
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
