<template lang="">
  <div class="bg-gray-600 p-2 pl-4 mt-2 rounded h-full overflow-y-scroll">
    <TemplateEditorPageBreadcrumb
      :template-list="templateStore.getBreadcrumbsOfCurrent"
    />

    <div class="w-full text-3xl font-semibold mb-4">
      {{ templateStore.currentTemplate.name }} - Template
    </div>
    <!-- parent templates -->
    <div class="bg-gray-400 py-4 rounded">
      <TemplateEditorPageSection
        v-for="(template, index) in templateStore.getParentsOfCurrent"
        :key="index"
        :attributes="template.attributes"
        :name="template.name"
        :activated="false"
      />
    </div>
    <TemplateEditorPageSection
      :attributes="templateStore.currentTemplate.attributes"
      :name="templateStore.currentTemplate.name"
    />
  </div>
</template>
<script setup>
import { useTemplateStore } from "~~/stores/template";
const templateStore = ref(useTemplateStore());
/* const currentTemplate = ref(useTemplateStore().currentTemplate); */
/* const templateList = [{ title: "Sword" }, { title: "Katana" }];
const templateBreadcrumbs = useTemplateStore().getParentsOfCurrent; */
</script>
