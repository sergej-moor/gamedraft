<template lang="">
  <div class="page w-full min-h-full gap-2">
    <TemplateTree class="menu__tree p-2"></TemplateTree>

    <div
      v-if="!useTemplateStore().showContentEditor"
      class="preview h-full flex flex-col"
    >
      <TemplateEditorTabbar class="tabs"></TemplateEditorTabbar>
      <TemplateEditorToolbar class="toolbar"></TemplateEditorToolbar>
      <TemplateEditorPage></TemplateEditorPage>
    </div>
    <div v-else class="preview">
      Content Editor stuff
      <EntryEditorPage />
    </div>

    <AttributeInspector
      v-if="!useTemplateStore().showContentEditor"
      :id="templateStore.selectedAttribute.id"
      :name="templateStore.selectedAttribute.name"
      :type="templateStore.selectedAttribute.type"
      class="attribute__inspector"
    ></AttributeInspector>
  </div>
</template>
<script setup>
import { useTemplateStore } from "@/stores/template";

const templateStore = ref(useTemplateStore());
// const selectedAttribute = ref(useTemplateStore().);
</script>
<style lang="scss" scoped>
.page {
  display: grid;
  grid-template-columns: 0.4fr 1.5fr 0.4fr;

  grid-auto-flow: row;
  grid-template-areas: "menu__tree preview attribute__inspector";
}

.preview {
  grid-area: preview;
}

.menu__tree {
  grid-area: menu__tree;
  overflow: scroll;
}

.attribute__inspector {
  grid-area: attribute__inspector;
  max-width: 100%;
}
</style>
