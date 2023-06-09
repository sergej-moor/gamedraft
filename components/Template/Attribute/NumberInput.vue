<template>
	<div class="flex-1 w-full">
		<label class="m-0 flex w-full">
			<span class="w-44 flex mr-4">
				<IconEdit></IconEdit>
				<input
					class="bg-gray-800 w-fit"
					type="text"
					placeholder="Attribute name"
					:value="title"
					@input="$emit('updateTitle', $event.target.value)"
				/>
			</span>
			<input
				type="text"
				placeholder="Text input field."
				class="bg-gray-200 rounded-sm text-white"
				disabled
			/>
		</label>
	</div>
</template>
<script setup>
	const props = defineProps({
		title: String,
	});
	const title = toRef(props, "title");
</script>
<style lang=""></style>
