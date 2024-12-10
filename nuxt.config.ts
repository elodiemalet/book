// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: '2024-04-03',
    devtools: {enabled: true},
    modules: [
        '@nuxt/content',
        '@pinia/nuxt',
        '@nuxt/ui'
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
})