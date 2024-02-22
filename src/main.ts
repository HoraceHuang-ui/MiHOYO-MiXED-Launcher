import {createApp} from 'vue'
import "./style.css"
import App from './App.vue'
// import './samples/node-api'
import router from "./router/router"
import i18n from './i18n'
import './assets/styles/fonts.css'
import './assets/styles/traffic.scss'

const app = createApp(App)

app.use(router)
app.use(i18n, {globalInstall: true})
app.mount('#app')
    .$nextTick(() => {
        postMessage({payload: 'removeLoading'}, '*')
    })
