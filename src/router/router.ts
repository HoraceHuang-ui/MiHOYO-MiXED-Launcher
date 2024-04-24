import * as VueRouter from 'vue-router'
import MainPage from '../pages/MainPage.vue'
import GamePage from '../pages/GamePage.vue'
import SettingsPage from '../pages/SettingsPage/SettingsPage.vue'
import GamepadPage from '../pages/GamepadPage/GamepadPage.vue'
import tmpPage from '../pages/tmpPage.vue'

const router = VueRouter.createRouter({
  history: VueRouter.createWebHashHistory(),
  routes: [
    {
      name: 'mainpage',
      path: '/',
      component: MainPage,
    },
    {
      name: 'gamepage',
      path: '/gamepage',
      component: GamePage,
    },
    {
      name: 'settingsPage',
      path: '/settingsPage',
      component: SettingsPage,
    },
    {
      name: 'gamepadPage',
      path: '/gamepadPage',
      component: GamepadPage,
    },
    {
      name: 'tempPage',
      path: '/tmppage',
      component: tmpPage,
    },
  ],
})

export default router
