import { createApp } from 'vue'
import ElementPlus from "element-plus"
import * as ElementPlusIconsVue from "@element-plus/icons-vue"
import "./style.css"
import App from './App.vue'
// import './samples/node-api'
import router from "./router"

createApp(App)
.use(router)
.use(ElementPlus)
  .mount('#app')
  // .$nextTick(() => {
  //   postMessage({ payload: 'removeLoading' }, '*')
  // })
