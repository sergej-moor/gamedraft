<template lang="">
	<div class="">
		<TemplatePreview
			:attributes="templateStore.currentTemplate.attributes"
			:name="templateStore.currentTemplate.name"
		>
		</TemplatePreview>
	</div>
</template>
<script setup>
	import { useTemplateStore } from "~~/stores/template";
	const templateStore = ref(useTemplateStore());

	//let attributes = ref();
</script>
