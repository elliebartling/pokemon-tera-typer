// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    modules: [
        '@pinia/nuxt',
        '@nuxtjs/tailwindcss',
        'nuxt-lodash',
        '@pinia/nuxt',
        '@nuxtjs/apollo',
        'nuxt-graphql-server',
        '@vueuse/nuxt'
        // 'nuxt-headlessui'
    ],
    css: ['@/assets/main.css'],
    apollo: {
        clients: {
            default: {
            httpEndpoint: 'https://api.spacex.land/graphql'
            }
        },
    },
    graphqlServer: {
        url: '/api/graphql',
    },
})
