<template>
	<div :style="ind">
		<a
			:class="{
				link: true,
				flex: true,
				'link-hover': true,
				'link-secondary': isCurrentContentPage(),
			}"
			@click="setContentPageId()"
		>
			<IconContentPage></IconContentPage>
			<div class="self-center ml-1">{{ name }}</div></a
		>
	</div>
</template>
<script setup>
	import { useTemplateStore } from "@/stores/template";
	const templateStore = useTemplateStore();

	const props = defineProps({
		name: String,

		id: Number,
		depth: Number,
	});

	const name = toRef(props, "name");
	const type = toRef(props, "type");
	const depth = toRef(props, "depth");
	const ind = ref({ transform: `translate(${depth.value * 20 + 35}px)` });

	function setContentPageId() {
		templateStore.setCurrentContentPageId(props.id);
	}

	function isCurrentContentPage() {
		return templateStore.currentContentPageId == props.id;
	} /* 
	let isCurrentAttribute = ref(templateStore.currentAttributeId == props.id); */
</script>
<style lang="scss">
	svg {
		display: inline;
	}
</style>
