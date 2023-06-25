<template lang="">
  <div class="bg-gray-400 pl-4 p-2 w-fit rounded-t">
    <a class="" @click="switchtab()"
      ><span class="pr-12">{{ name }}</span>

      <button>X</button>
    </a>
  </div>
</template>
<script setup>
import { useTemplateStore } from "~~/stores/template";
const templateStore = useTemplateStore();

const props = defineProps({
  name: String,
  tabIndex: Number,
});

function switchtab() {
  templateStore.switchTab(props.tabIndex);
}
</script>
<style lang=""></style>
