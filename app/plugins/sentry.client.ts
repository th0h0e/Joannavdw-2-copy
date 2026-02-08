import * as Sentry from '@sentry/vue'

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()

  Sentry.init({
    app: nuxtApp.vueApp,
    dsn: config.public.sentryDsn as string,
    sendDefaultPii: true,
  })
})
