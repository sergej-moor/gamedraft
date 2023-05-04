<template lang="">
	<div>
		<a class="tab" @click="switchtab()">Tab 1</a>
	</div>
</template>
<script setup>
	import { useTemplateStore } from "~~/stores/template";
	const templateStore = useTemplateStore();

	const props = defineProps({
		name: String,
		tabIndex: Number,
	});

	function switchtab() {
		templateStore.switchTab(props.tabIndex);
	}
</script>
<style lang=""></style>
