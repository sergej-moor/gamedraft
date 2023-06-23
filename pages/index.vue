<template lang="">
	<div class="page w-full min-h-full gap-2">
		<TemplateTreeMenuTree class="menu__tree p-2"></TemplateTreeMenuTree>

		<div
			class="preview h-full flex flex-col"
			v-if="!useTemplateStore().showContentEditor"
		>
			<TemplateTabs class="tabs"></TemplateTabs>
			<TemplateToolbar class="toolbar"></TemplateToolbar>
			<TemplatePage></TemplatePage>
		</div>
		<div class="preview" v-else>
			Content Editor stuff
			<Entry/>
		</div>

		<TemplateAttributeInspector
			:name="templateStore.selectedAttribute.name"
			:id="templateStore.selectedAttribute.id"
			:type="templateStore.selectedAttribute.type"
			class="attribute__inspector"
		></TemplateAttributeInspector>
	</div>
</template>
<script setup>
	import { useTemplateStore } from "@/stores/template";
	import { Textfield, Numberfield } from "../classes/Attributes";

	const templateStore = ref(useTemplateStore());
	//const selectedAttribute = ref(useTemplateStore().);
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
