// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    modules: ['@nuxtjs/tailwindcss','@pinia/nuxt'],
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
