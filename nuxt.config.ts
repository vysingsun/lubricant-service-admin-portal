// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/ui',
    '@pinia/nuxt',
    '@pinia/colada-nuxt',
    '@nuxtjs/i18n'
  ],

  // Components and composables live under app/features/* and app/shared/*
  // (feature-based structure) instead of Nuxt's default top-level
  // components/composables dirs, so both need to be scanned explicitly.
  components: [
    { path: '~/shared/components', pathPrefix: false },
    { path: '~/features/auth/components', pathPrefix: false },
    { path: '~/features/stores-management/components', pathPrefix: false },
    { path: '~/features/products/components', pathPrefix: false },
    { path: '~/features/staff/components', pathPrefix: false },
    { path: '~/features/orders/components', pathPrefix: false },
    { path: '~/features/bakong-tokens/components', pathPrefix: false }
  ],

  imports: {
    dirs: [
      'shared/composables',
      'shared/utils',
      'features/auth/composables',
      'features/auth/stores',
      'features/stores-management/composables',
      'features/stores-management/queries',
      'features/stores-management/stores',
      'features/products/composables',
      'features/products/queries',
      'features/staff/queries',
      'features/orders/queries',
      'features/bakong-tokens/queries'
    ]
  },

  devtools: {
    enabled: true
  },

  css: ['~/assets/css/main.css'],

  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL || 'http://localhost:3000',
      // Login happens directly against kot-preng-api (the NestJS backend
      // only verifies tokens, it doesn't issue them).
      kotPrengApiBaseUrl: process.env.NUXT_PUBLIC_KOT_PRENG_API_URL || 'https://kot-bong-api-dev.onrender.com/api'
    }
  },

  routeRules: {
    '/login': { prerender: true }
  },

  compatibilityDate: '2026-06-30',

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  },

  i18n: {
    locales: [
      { code: 'en', language: 'en-US', name: 'English', file: 'en.json' },
      { code: 'km', language: 'km-KH', name: 'ខ្មែរ', file: 'km.json' }
    ],
    langDir: 'locales',
    defaultLocale: 'en',
    strategy: 'no_prefix',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      redirectOn: 'root'
    }
  }
})
