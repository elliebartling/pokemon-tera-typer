// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    modules: [
        '@pinia/nuxt',
        '@nuxtjs/tailwindcss',
        'nuxt-lodash',
        '@pinia/nuxt',
        // 'nuxt-headlessui'
    ],
    css: ['@/assets/main.css'],
})
