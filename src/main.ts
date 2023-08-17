import { createApp } from 'vue'
import "./style.css"
import App from './App.vue'
// import './samples/node-api'
import router from "./router"
import './assets/styles/fonts.css'
import './assets/styles/traffic.scss'
import 'element-plus/theme-chalk/dark/css-vars.css'

const app = createApp(App)

app.use(router)
app.mount('#app')
  // .$nextTick(() => {
  //   postMessage({ payload: 'removeLoading' }, '*')
  // })
