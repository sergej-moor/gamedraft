<template>
  <div>
    <VueSimpleContextMenu
      :element-id="templateId.toString()"
      :options="options"
      ref="vueSimpleContextMenu"
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
          @click="showChildren = !showChildren"
          v-if="true"
          :expanded="showChildren"
        ></UtilityExpandButton>
        <div v-else class="m-1"></div>
        <div class="self-center">{{ name }}</div>
      </div>
    </a>

    <!-- Render template attributes -->
    <!-- 		<TemplateMenuItemAttribute
			v-if="showChildren"
			v-for="att in attributes"
			:name="att.name"
			:type="att.type"
			:depth="depth"
			:id="att.id"
		></TemplateMenuItemAttribute> -->

    <!-- Render Content Pages -->
    <TemplateTreeMenuItemEntry
      v-if="showChildren"
      v-for="content in entries"
      :name="content.name"
      :depth="depth"
      :id="content.id"
    >
    </TemplateTreeMenuItemEntry>

    <!-- Render child templates -->
    <TemplateTreeMenuItemTemplate
      v-if="showChildren"
      v-for="node in children"
      :children="node.children"
      :name="node.name"
      :depth="depth + 1"
      :attributes="node.attributes"
      :templateId="node.id"
      :entries="node.entries"
    />

    <slot></slot>
  </div>
</template>
<script>
export default {
  name: "MenuItem",
};
</script>
<script setup>
import { useTemplateStore } from "~~/stores/template";
import VueSimpleContextMenu from "vue-simple-context-menu";
import { ref } from "vue";
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
const attributes = toRef(props, "attributes");
const templateId = toRef(props, "templateId");
const entries = toRef(props, "entries");
let showChildren = ref(true);

function isCurrentTemplate() {
  return templateId.value === templateStore.selectedTemplateId;
}

function toggleChildren() {
  showChildren.value = !showChildren.value;
}

const childrenExist = ref(
  children.value != undefined && children.value.length > 0
);

function selectTemplate() {
  templateStore.setSelectedTemplateId(templateId.value);

  //console.clear();
  //console.log(templateStore.getParentsOfCurrent)
}

/* CONTEXT MENU */

let deleteDialog = ref(false);

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
  //console.log(vueSimpleContextMenu.value);

  let menus = document.getElementsByClassName("vue-simple-context-menu");
  //console.log("MENUS");
  //console.log(menus);

  Array.from(menus).forEach((menu) => {
    menu.classList.remove("vue-simple-context-menu--active");
  });
  vueSimpleContextMenu.value.showMenu(event, null);
}

function optionClicked(event) {
  //window.alert(JSON.stringify(event));
  if (event.option.slug == "delete") {
    //templateStore.deleteCurrentTemplate(templateId.value);
    deleteDialog.value = true;
  }
}
/* 	function childrenExist() {
		if (children.value != undefined) {
			console.log(children.value);
			return children.value.length > 1;
		}
		return false;
	}
 */
/* else {
		childrenExist.value = false;
	} */

/* const attributesAsText = ref("nothing");
	const attributesAsObj = ref([]);
	if (attributes.value != undefined) {
		let text = "";
		attributes.value.forEach((att) => {
			text += att.name + "\n";
		});
		attributesAsText.value = text;
	} */
/* 	const indent = computed({
		get() {
			return { transform: `translate(${depth.value * 50}px)` };
		},
	}); */

const depth = toRef(props, "depth");
const ind = ref({ marginLeft: `${depth.value * 20}px` });
</script>
<style lang=""></style>
