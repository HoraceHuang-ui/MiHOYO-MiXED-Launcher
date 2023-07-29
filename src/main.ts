import { createApp } from 'vue'
import "./style.css"
import App from './App.vue'
// import './samples/node-api'
import router from "./router"

createApp(App)
.use(router)
  .mount('#app')
  // .$nextTick(() => {
  //   postMessage({ payload: 'removeLoading' }, '*')
  // })
