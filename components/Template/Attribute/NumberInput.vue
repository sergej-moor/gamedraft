<template>
	<div class="flex-1 w-full">
		<label class="m-0 flex w-full">
			<span class="flex mr-4">
				<IconEdit></IconEdit>
				<input
					class="form-input text-sm bg-gray-800 border-none w-fit outline-none focus:outline-none px-2 py-1"
					type="text"
					placeholder="Attribute name"
					:value="title"
					@input="$emit('updateTitle', $event.target.value)"
				/>
			</span>
			<input
				type="number"
				placeholder="Number input field."
				class="form-input text-sm bg-gray-200 border-none rounded-sm text-white placeholder-gray-100 px-2 py-1"
				disabled
			/>
		</label>
	</div>
</template>
<script setup>
	import { useTemplateStore } from "@/stores/template";
	const templateStore = useTemplateStore();

	const props = defineProps({
		title: String,
	});

	const title = toRef(props, "title");
</script>
<style lang=""></style>
