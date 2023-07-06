<template lang="">
  <div class="page w-full min-h-full gap-2">
    <TemplateTree class="menu__tree p-2" />

    <div class="preview h-full flex flex-col">
      <TemplateEditorTabbar class="tabs" />
      <TemplateEditorToolbar class="toolbar" />
      <div v-if="!useTemplateStore().showContentEditor">
        <TemplateEditorPage />
      </div>
      <div v-else>
        <EntryEditorPage />
      </div>
    </div>
    <AttributeInspector
      v-if="!useTemplateStore().showContentEditor"
      :id="templateStore.selectedAttribute.id"
      :name="templateStore.selectedAttribute.name"
      :type="templateStore.selectedAttribute.type"
      class="attribute__inspector"
    />
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
