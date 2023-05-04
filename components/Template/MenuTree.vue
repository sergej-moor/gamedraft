<template lang="">
	<div class="bg-slate-800">
		<h2 class="prose text-center m-2">Template Tree</h2>
		<TemplateMenuItem
			:name="templateTree.name"
			:childTemplates="templateTree.childTemplates"
			:depth="0"
			:attributes="templateTree.attributes"
			:templateId="templateTree.id"
		>
		</TemplateMenuItem>
	</div>
</template>
<script setup>
	import { useTemplateStore } from "~~/stores/template";
	const templateStore = useTemplateStore();
	//const title = ref(templateStore.getMenuTree());
	/* 	let tree = {
		name: "root",
		attributes: [
			{ name: "Textfield1", type: "Text" },
			{ name: "Textfield2", type: "Text" },
		],
		childTemplates: [
			{
				name: "item1",

				childTemplates: [
					{
						name: "item1.1",
						attributes: [{ name: "233", type: "Number" }],
					},
					{
						name: "item1.2",
						childTemplates: [
							{
								name: "item1.2.1",
								attributes: [{ name: "Textfi233", type: "Text" }],
							},
						],
					},
				],
			},
			{
				name: "item2",
			},
		],
	}; */
	//const templateStore = useTemplateStore();
	//const templateTree = toRef(templateStore.value);
	const templateTree = ref(templateStore.rootTemplate);
</script>
