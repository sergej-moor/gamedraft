<template>
	<div>
		<VueSimpleContextMenu
			:element-id="templateId.toString()"
			:options="options"
			ref="vueSimpleContextMenu"
			@option-clicked="optionClicked"
		/>

		<a
			@click="setCurrentTemplate()"
			@contextmenu.prevent.stop="showContextMenu($event)"
		>
			<div
				class="flex rounded-sm hover:bg-blue-500"
				:class="{
					/* 		'border-2': isCurrentTemplate(),
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
		<TemplateTreeMenuItemContentPage
			v-if="showChildren"
			v-for="content in contentPages"
			:name="content.name"
			:depth="depth"
			:id="content.id"
		>
		</TemplateTreeMenuItemContentPage>

		<!-- Render child templates -->
		<TemplateTreeMenuItemTemplate
			v-if="showChildren"
			v-for="node in childTemplates"
			:childTemplates="node.childTemplates"
			:name="node.name"
			:depth="depth + 1"
			:attributes="node.attributes"
			:templateId="node.id"
			:contentPages="node.contentPages"
		>
		</TemplateTreeMenuItemTemplate>

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
		childTemplates: Array,
		depth: Number,
		attributes: Array,
		templateId: Number,
		contentPages: Array,
	});
	const name = toRef(props, "name");
	const childTemplates = toRef(props, "childTemplates");
	const attributes = toRef(props, "attributes");
	const templateId = toRef(props, "templateId");
	const contentPages = toRef(props, "contentPages");
	let showChildren = ref(true);

	function isCurrentTemplate() {
		return templateId.value === templateStore.currentTemplateId;
	}

	function toggleChildren() {
		showChildren.value = !showChildren.value;
	}

	const childrenExist = ref(
		childTemplates.value != undefined && childTemplates.value.length > 0
	);

	function setCurrentTemplate() {
		console.log("HEY");
		templateStore.setCurrentTemplateId(templateId.value);
	}

	/* CONTEXT MENU */

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
			window.alert("YO" + name.value);
		}
	}
	/* 	function childrenExist() {
		if (childTemplates.value != undefined) {
			console.log(childTemplates.value);
			return childTemplates.value.length > 1;
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
