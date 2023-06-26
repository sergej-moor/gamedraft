<template lang="">
  <div>
    <div class="text-sm my-1 breadcrumbs text-gray-100">
      <ul class="flex">
        <li class="mx-1" v-for="(template, index) in templates" :key="index">
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
  templateList: Array,
});
const templates = toRef(props, "templateList");

function switchTemplate(id) {
  templateStore.setSelectedTemplateId(id);
}
</script>
<style lang=""></style>
