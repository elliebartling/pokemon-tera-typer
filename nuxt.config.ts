// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    modules: [
        '@pinia/nuxt',
        '@nuxtjs/tailwindcss',
        'nuxt-lodash',
        '@pinia/nuxt',
        '@nuxtjs/apollo',
        'nuxt-graphql-server',
        '@vueuse/nuxt',
        // '@nuxt/image',
        // '@nuxt/image-edge',
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
    // target: 'static',
    // buildModules: [
    //     '@nuxt/image-edge',
    // ]
    // graphqlServer: {
    //     url: '/api/graphql',
    // },
})
