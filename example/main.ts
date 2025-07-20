import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import Demo from './Demo.vue'
import '../dist/style.css'

const app = createApp(Demo)

app.use(ElementPlus)

app.mount('#app') 