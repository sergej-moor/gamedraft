import VueSimpleContextMenu from "vue-simple-context-menu";
import "vue-simple-context-menu/dist/vue-simple-context-menu.css";

export default defineNuxtPlugin((nuxtApp) => {
	nuxtApp.vueApp.use(VueSimpleContextMenu, {});
});
