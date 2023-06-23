<template lang="">
	<div class="bg-gray-400 rounded-t">
		<h2 class="text-lg text-center m-2">Template Tree</h2>
		<TemplateTreeSearchbar></TemplateTreeSearchbar>
		<button class="btn" @click="addEntry()">
			Add Entry to current Template
		</button>

		<TemplateTreeMenuItemTemplate
			:name="templateTree.name"
			:children="templateTree.children"
			:depth="0"
			:attributes="templateTree.attributes"
			:templateId="templateTree.id"
			:entries="templateTree.entries"
		>
		</TemplateTreeMenuItemTemplate>
	</div>
</template>
<script setup>
	import { useTemplateStore } from "~~/stores/template";
	import Entry from "~~/classes/Entry";
	const templateStore = useTemplateStore();
	const templateTree = ref(templateStore.rootTemplate);

	function addEntry() {
		let content = new Entry("hallo");
		console.log("addContent Page");
		templateStore.addEntry(content);
	}

	function onPressW() {
		console.log("WWW");
	}

	//const title = ref(templateStore.getMenuTree());
	/* 	let tree = {
		name: "root",
		attributes: [
			{ name: "Textfield1", type: "Text" },
			{ name: "Textfield2", type: "Text" },
		],
		children: [
			{
				name: "item1",

				children: [
					{
						name: "item1.1",
						attributes: [{ name: "233", type: "Number" }],
					},
					{
						name: "item1.2",
						children: [
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
</script>
~~/classes/Entry~~/classes/Entry