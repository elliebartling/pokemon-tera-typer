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
                httpEndpoint: 'https://beta.pokeapi.co/graphql/v1beta'
            }
        },
    },
    // graphqlServer: {
    //     url: '/api/graphql',
    // },
})
