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
		<div class="form-control w-full">
			<label class="label p-1">
				<span class="label-text text-xs">Attribute Name</span>
			</label>
			<input
				:value="name"
				@input="(event) => updateAttributeName(event.target.value)"
				type="text"
				placeholder="name"
				class="input input-bordered input-xs w-full"
			/>
		</div>

		<!-- Default Value -->
		<div class="form-control w-full">
			<label class="label p-1">
				<span class="label-text text-xs">Default Value</span>
			</label>
			<div class="flex">
				<input type="checkbox" class="checkbox" />
				<input
					type="text"
					placeholder="default val"
					class="input input-bordered input-xs w-full"
				/>
			</div>
		</div>

		<div class="divider"></div>
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
