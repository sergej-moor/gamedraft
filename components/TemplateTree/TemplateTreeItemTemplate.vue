<template>
  <div>
    <VueSimpleContextMenu
      ref="vueSimpleContextMenu"
      :element-id="templateId.toString()"
      :options="options"
      @option-clicked="optionClicked"
    />

    <dialog :open="deleteDialog">
      <p>are you sure you wanna delete this shi</p>
      <button @click="deleteDialog = false">Close</button>
    </dialog>

    <a
      @click="selectTemplate()"
      @contextmenu.prevent.stop="showContextMenu($event)"
    >
      <div
        class="flex rounded-sm hover:bg-blue-500"
        :class="{
          /* 		'bo rder-2': isCurrentTemplate(),
					'border-blue-200': isCurrentTemplate(),
					'bg-blue-500': isCurrentTemplate(), 
					'hover:text-white': isCurrentTemplate(),*/
          'text-blue-200': isCurrentTemplate(),
        }"
        :style="ind"
      >
        <UtilityExpandButton
          v-if="true"
          :expanded="showChildren"
          @click="showChildren = !showChildren"
        ></UtilityExpandButton>
        <div v-else class="m-1"></div>
        <div class="self-center">{{ name }}</div>
      </div>
    </a>

    <!-- Render Content Pages -->
    <div v-if="showChildren">
      <TemplateTreeItemEntry
        v-for="(content, index) in entries"
        :id="content.id"
        :key="index"
        :name="content.name"
        :depth="depth"
      >
      </TemplateTreeItemEntry>
    </div>

    <!-- Render child templates -->
    <div v-if="showChildren">
      <TemplateTreeItemTemplate
        v-for="(node, index) in children"
        :key="index"
        :children="node.children"
        :name="node.name"
        :depth="depth + 1"
        :attributes="node.attributes"
        :template-id="node.id"
        :entries="node.entries"
      />
    </div>

    <slot></slot>
  </div>
</template>
<script></script>
<script setup>
import VueSimpleContextMenu from "vue-simple-context-menu";
import { ref } from "vue";
import { useTemplateStore } from "~~/stores/template";

const templateStore = useTemplateStore();
const props = defineProps({
  name: String,
  children: Array,
  depth: Number,
  attributes: Array,
  templateId: Number,
  entries: Array,
});
const name = toRef(props, "name");
const children = toRef(props, "children");

const templateId = toRef(props, "templateId");
const entries = toRef(props, "entries");
const showChildren = ref(true);

function isCurrentTemplate() {
  return templateId.value === templateStore.selectedTemplateId;
}

/* const childrenExist = ref(
  children.value != undefined && children.value.length > 0
); */

function selectTemplate() {
  templateStore.setSelectedTemplateId(templateId.value);

  // console.clear();
  // console.log(templateStore.getParentsOfCurrent)
}

/* CONTEXT MENU */

const deleteDialog = ref(false);

const options = [
  {
    name: "Duplicate",
    slug: "duplicate",
  },
  {
    type: "divider",
  },
  {
    name: "Rename",
    slug: "rename",
  },
  {
    name: "<em>Delete</em>",
    slug: "delete",
  },
];
const vueSimpleContextMenu = ref(null);

function showContextMenu(event) {
  // console.log(vueSimpleContextMenu.value);

  const menus = document.getElementsByClassName("vue-simple-context-menu");
  // console.log("MENUS");
  // console.log(menus);

  Array.from(menus).forEach((menu) => {
    menu.classList.remove("vue-simple-context-menu--active");
  });
  vueSimpleContextMenu.value.showMenu(event, null);
}

function optionClicked(event) {
  // window.alert(JSON.stringify(event));
  if (event.option.slug === "delete") {
    // templateStore.deleteCurrentTemplate(templateId.value);
    deleteDialog.value = true;
  }
}

const depth = toRef(props, "depth");
const ind = ref({ marginLeft: `${depth.value * 20}px` });
</script>
<style lang=""></style>
