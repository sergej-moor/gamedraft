<template lang="">
	<div class="h-full">
		<TemplatePreview
			:attributes="templateStore.currentTemplate.attributes"
			:name="templateStore.currentTemplate.name"
		/>
	</div>
</template>
<script setup>
	import { useTemplateStore } from "~~/stores/template";
	const templateStore = ref(useTemplateStore());
</script>
