import { createApp } from 'vue'
import { createPinia, setMapStoreSuffix } from 'pinia'

import App from './App.vue'
import router from './router'

import './assets/main.css'

const app = createApp(App)

setMapStoreSuffix('')
app.use(createPinia())
app.use(router)

app.mount('#app')
