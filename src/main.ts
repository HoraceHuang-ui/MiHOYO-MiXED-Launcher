import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
// import './samples/node-api'
import router from './router/router'
import i18n from './i18n'
import './assets/styles/fonts.css'
import './assets/styles/traffic.scss'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

const app = createApp(App)

app.use(router)
app.use(i18n, { globalInstall: true })
app.use(pinia)
app.mount('#app').$nextTick(() => {
  postMessage({ payload: 'removeLoading' }, '*')
})
