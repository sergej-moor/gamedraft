<template lang="">
	<div class="bg-gray-400 rounded-tl flex flex-wrap flex-col px-2">
		<h2 class="text-center text-lg m-2">Attribute Inspector</h2>

		<!-- Attribute Type -->
		<div class="text-xs p-1">
			<!-- {{
				templateStore.currentAttribute != null
					? templateStore.currentAttribute.type
					: "none"
			}} -->
			{{ type }}
			Attribute | ID:
			{{ id }}
			<!-- {{ templateStore.currentAttribute.id }} -->
			<!-- 		{{
				templateStore.currentAttribute != null
					? templateStore.currentAttribute.id
					: "none"
			}} -->
		</div>
		<!-- Attribute Name -->
		<div class="w-full">
			<label class="">
				<span class="">Attribute Name</span>
			</label>
			<input
				:value="name"
				@input="(event) => updateAttributeName(event.target.value)"
				type="text"
				placeholder="name"
				class="w-full rounded-sm bg-gray-200 p-1 text-sm"
			/>
		</div>

		<div class="">
			<div class="flex align-baseline w-full my-1 py-1 h-8">
				<input
					type="checkbox"
					class="focus:ring-white checked:gray-800"
					name=""
					id="ch"
				/>
				<label for="ch" class="text-sm ml-2">Hey</label>
			</div>
		</div>

		<!-- Default Value -->

		<TemplateInspectorNumber v-if="type == 'number'"></TemplateInspectorNumber>
	</div>
</template>
<script setup>
	import { useTemplateStore } from "@/stores/template";

	const props = defineProps({
		name: String,
		type: String,
		id: Number,
	});

	const { updateCurrentAttributeName } = useTemplateStore();

	function updateAttributeName(newName) {
		updateCurrentAttributeName(newName);
	}
</script>
<style scoped lang="scss">
	div {
	}
	.attributeinspector {
	}
</style>
