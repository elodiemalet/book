// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: '2024-04-03',
    devtools: {enabled: true},
    content: {
        watch: {
            ws: {
                hostname: "0.0.0.0",
                port: 4000,
                showURL: false
            }
        },
    },
    modules: [
      '@nuxt/content',
      '@pinia/nuxt',
      '@nuxt/ui',
      'nuxt-auth-utils',
      '@vueuse/nuxt',
    ],
    css: [
        '~/assets/styles/fonts.css',
        '~/assets/styles/main.scss',
    ],
    postcss: {
        plugins: {
            tailwindcss: {},
            autoprefixer: {},
        },
    },
});
