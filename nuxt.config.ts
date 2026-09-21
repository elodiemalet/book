// https://nuxt.com/docs/api/configuration/nuxt-config
import vue from '@vitejs/plugin-vue';

export default defineNuxtConfig({
    compatibilityDate: '2024-04-03',
    devtools: {enabled: true},
    runtimeConfig: {
        pdfApiToken: process.env.PDF_API_TOKEN,
        public: {},
    },
    app: {
        head: {
            link: [
                {
                    rel: 'preconnect',
                    href: 'https://cdn.fontshare.com',
                },
                {
                    rel: 'stylesheet',
                    href: 'https://api.fontshare.com/v2/css?f[]=cabinet-grotesk@800,500,700&display=swap',
                },
                {
                    rel: 'stylesheet',
                    href: 'https://api.fontshare.com/v2/css?f[]=satoshi@800,500,700&display=swap',
                },
            ],
        },
    },
    content: {
        watch: {
            enabled: true,
            port: 4000,
            showURL: false
        },
    },
    modules: ['@pinia/nuxt', '@nuxt/ui', 'nuxt-auth-utils', '@vueuse/nuxt', '@nuxtjs/tailwindcss'],
    css: [
        '~/assets/styles/fonts.scss',
        '~/assets/styles/tailwind.css',
        '~/assets/styles/main.scss',
        '~/assets/styles/pageSize.scss',
    ],
    postcss: {
        plugins: {
            tailwindcss: {},
            autoprefixer: {},
        },
    },
    nitro: {
        sourcemap: false,
        rollupConfig: {
            plugins: [vue()]
        },
    },
    ssr: {
        sourcemap: false
    },
    build: {
        sourcemap: false,
    },
});
