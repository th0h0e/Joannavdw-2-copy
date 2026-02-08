import * as Sentry from '@sentry/vue'
import { createApp } from 'vue'
import App from './app.vue'
import { router } from './router'
import '@/assets/css/main.css'

const app = createApp(App)

Sentry.init({
  app,
  dsn: 'https://4981600ff5cc02441de606ca9943a126@o4510808141398016.ingest.de.sentry.io/4510808149983312',
  sendDefaultPii: true,
})

app.use(router)
app.mount('#app')
