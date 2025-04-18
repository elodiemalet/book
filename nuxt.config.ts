// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: '2024-04-03',
    devtools: {enabled: true},
    content: {
        watch: {
            enabled: true,
            port: 4000,
            showURL: false
        },
    },
    modules: [
        '@pinia/nuxt',
        '@nuxt/ui',
        'nuxt-auth-utils',
        '@vueuse/nuxt',
    ],
    css: [
        '~/assets/styles/fonts.scss',
        '~/assets/styles/main.scss',
    ],
    postcss: {
        plugins: {
            tailwindcss: {},
            autoprefixer: {},
        },
    },
});
