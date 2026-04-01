import { createApp } from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import router from './router'
import { vReveal } from './directives/scrollReveal'

const app = createApp(App)
app.use(vuetify)
app.use(router)
app.directive('reveal', vReveal)
app.mount('#app')
