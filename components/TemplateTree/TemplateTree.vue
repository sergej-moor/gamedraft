<template lang="">
  <div class="bg-gray-400 rounded-t">
    <h2 class="text-lg text-center m-2">Template Tree</h2>
    <TemplateTreeSearchbar></TemplateTreeSearchbar>
    <button class="btn" @click="addEntry()">
      Add Entry to current Template
    </button>

    <TemplateTreeItemTemplate
      :name="templateTree.name"
      :children="templateTree.children"
      :depth="0"
      :attributes="templateTree.attributes"
      :template-id="templateTree.id"
      :entries="templateTree.entries"
    >
    </TemplateTreeItemTemplate>
  </div>
</template>
<script setup>
import { useTemplateStore } from "~~/stores/template";
const store = useTemplateStore();
const templateTree = ref(store.rootTemplate);

function addEntry() {
  templateStore.addEntry();
}
</script>
