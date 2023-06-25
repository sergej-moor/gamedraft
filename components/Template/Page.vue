<template lang="">
  <div class="bg-gray-600 p-2 mt-2 rounded h-full overflow-y-scroll">
    <button @click="testoutput">hey</button>
    <TemplateBreadcrumb :templateList="templateStore.getParentsOfCurrent" />
    <div class="w-full text-3xl font-semibold">Templates</div>
    <TemplatePreview
      v-for="(template, index) in templateStore.getParentsOfCurrent"
      :key="index"
      :attributes="template.attributes"
      :name="template.name"
      :activated="false"
    />
  </div>
</template>
<script setup>
import { useTemplateStore } from "~~/stores/template";
const templateStore = ref(useTemplateStore());
/* const templateList = [{ title: "Sword" }, { title: "Katana" }];
const templateBreadcrumbs = useTemplateStore().getParentsOfCurrent; */
</script>
