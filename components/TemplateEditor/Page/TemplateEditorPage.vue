<template lang="">
  <div class="bg-gray-600 p-2 pl-4 mt-2 rounded h-full overflow-y-scroll">
    <TemplateEditorPageBreadcrumb
      :template-list="store.getBreadcrumbsOfCurrent"
    />

    <div class="w-full text-3xl font-semibold mb-4">
      {{ store.currentTemplate.name }} - Template
    </div>
    <!-- parent templates -->
    <div class="bg-gray-400 py-4 rounded">
      <TemplateEditorPageSection
        v-for="(template, index) in store.getParentsOfCurrent"
        :key="index"
        :attributes="template.attributes"
        :name="template.name"
        :activated="false"
      />
    </div>
    <TemplateEditorPageSection
      :attributes="store.currentTemplate.attributes"
      :name="store.currentTemplate.name"
    />
  </div>
</template>
<script setup>
import { useTemplateStore } from "~~/stores/template";
const store = ref(useTemplateStore());
/* const currentTemplate = ref(useTemplateStore().currentTemplate); */
/* const templateList = [{ title: "Sword" }, { title: "Katana" }];
const templateBreadcrumbs = useTemplateStore().getParentsOfCurrent; */
</script>
