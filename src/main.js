import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import App from './App.vue'
import './assets/styles/main.css'

import 'vue-sonner/style.css'
import { Toaster } from 'vue-sonner'
import { initTheme } from './utils/theme'

initTheme()

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.component('Toaster', Toaster)

app.mount('#app')