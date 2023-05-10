<template>
	<div class="">
		<a
			class=""
			:class="{
				link: true,
				'link-hover': true,
				'link-primary': isCurrentTemplate(),
			}"
			@click="setCurrentTemplate()"
		>
			<div :style="ind" class="flex">
				<UtilityExpandButton
					@click="showChildren = !showChildren"
					v-if="true"
					:expanded="showChildren"
				></UtilityExpandButton>
				<div v-else class="btn btn-xs btn-square m-1"></div>
				<div class="self-center">{{ name }}</div>
			</div>
		</a>

		<!-- Render template attributes -->
		<TemplateMenuItemAttribute
			v-if="showChildren"
			v-for="att in attributes"
			:name="att.name"
			:type="att.type"
			:depth="depth"
			:id="att.id"
		></TemplateMenuItemAttribute>

		<!-- Render Content Pages -->
		<TemplateMenuItemContentPage
			v-if="showChildren"
			v-for="content in contentPages"
			:name="content.name"
			:depth="depth"
			:id="content.id"
		>
		</TemplateMenuItemContentPage>

		<!-- Render child templates -->
		<TemplateMenuItem
			v-if="showChildren"
			v-for="node in childTemplates"
			:childTemplates="node.childTemplates"
			:name="node.name"
			:depth="depth + 1"
			:attributes="node.attributes"
			:templateId="node.id"
			:contentPages="node.contentPages"
		>
		</TemplateMenuItem>

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
		return props.templateId === templateStore.currentTemplateId;
	}

	function toggleChildren() {
		showChildren.value = !showChildren.value;
	}

	const childrenExist = ref(
		childTemplates.value != undefined && childTemplates.value.length > 0
	);

	function setCurrentTemplate() {
		templateStore.setCurrentTemplateId(templateId.value);
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
	const ind = ref({ transform: `translate(${depth.value * 20}px)` });
</script>
<style lang=""></style>
