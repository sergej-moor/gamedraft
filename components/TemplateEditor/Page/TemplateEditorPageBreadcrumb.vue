<template lang="">
  <div>
    <div class="text-sm my-1 breadcrumbs text-gray-100">
      <ul class="flex">
        <li v-for="(template, index) in templates" :key="index" class="mx-1">
          <span v-if="index != 0"> > </span
          ><a
            class="hover:underline hover:cursor-pointer"
            @click="switchTemplate(template.id)"
          >
            {{ template.name }}
          </a>
        </li>
      </ul>
    </div>
  </div>
</template>
<script setup>
import { useTemplateStore } from "~~/stores/template";
const templateStore = useTemplateStore();

const props = defineProps({
  templateList: {
    type: Array,
    default() {
      return [];
    },
  },
});
const templates = toRef(props, "templateList");

function switchTemplate(id) {
  templateStore.setSelectedTemplateId(id);
}
</script>
<style lang=""></style>
