import { type NuxtConfig } from "nuxt/schema"

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },
  modules: ['better-convex-nuxt', '@pinia/nuxt', 'pinia-plugin-persistedstate/nuxt', 'nuxt-auth-utils'],
  pinia: {
    storesDirs: ['./app/stores/**']
  },
  convex: {
    url: 'http://127.0.0.1:3210',
    siteUrl: 'http://127.0.0.1:3211',
    auth: {
      enabled: false,
    },
  },
  runtimeConfig: {
    public: {
      convex: {
        url: 'http://127.0.0.1:3210',
        siteUrl: 'http://127.0.0.1:3211',
      }
    }
  },
  vite: {
    optimizeDeps: {
      include: [
        'convex/server',
      ]
    }
  },
} as NuxtConfig)
