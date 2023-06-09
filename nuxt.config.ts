// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    "@nuxtjs/tailwindcss",
    "@pinia/nuxt",
    "@pinia-plugin-persistedstate/nuxt",
  ],
  components: {
    dirs: ["~/components", "~/components/Utility"],
  },
  plugins: [
    { src: "~/plugins/simple-context-menu.js", ssr: false },
    { src: "~/plugins/floating-vue.js", ssr: false },
  ],
  /*     vue:{
        compilerOptions:{
            isCustomElement: (tag) => ['lite']
        }
    } */
});
