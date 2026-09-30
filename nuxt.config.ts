// https://nuxt.com/docs/api/configuration/nuxt-config
import vue from '@vitejs/plugin-vue';

export default defineNuxtConfig({
    compatibilityDate: '2024-04-03',
    // Structure Nuxt 3 conservée (pas de dossier app/)
    srcDir: '.',
    dir: {app: 'app'},
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
                {
                    rel: 'preconnect',
                    href: 'https://fonts.googleapis.com',
                },
                {
                    rel: 'preconnect',
                    href: 'https://fonts.gstatic.com',
                    crossorigin: '',
                },
                {
                    rel: 'stylesheet',
                    href: 'https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300..600;1,9..144,300..600&family=Instrument+Sans:wght@400..600&family=Newsreader:ital,opsz,wght@0,6..72,300..600;1,6..72,300..600&display=swap',
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
    modules: ['@pinia/nuxt', '@nuxt/ui', 'nuxt-auth-utils', '@vueuse/nuxt'],
    css: [
        '~/assets/styles/fonts.scss',
        '~/assets/styles/tailwind.css',
        '~/assets/styles/main.css',
        '~/assets/styles/pageSize.scss',
    ],
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
