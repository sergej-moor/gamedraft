// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    modules: ['@nuxtjs/tailwindcss','@pinia/nuxt','@pinia-plugin-persistedstate/nuxt',],
    components:{
        dirs:[
            '~/components',
            '~/components/Utility',
        ]
    },
/*     vue:{
        compilerOptions:{
            isCustomElement: (tag) => ['lite']
        }
    } */
    
})
