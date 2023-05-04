<template>
	<div class="flex-1 w-full">
		<label class="input-group input-group-xs input-group-vertical w-full m-0">
			<span class="w-full flex p-0">
				<input
					class="w-full input input-sm input-ghost focus:outline-none focus:bg-transparent"
					type="text"
					placeholder="Attribute name"
					:value="title"
					@input="$emit('updateTitle', $event.target.value)"
				/>
				<IconEdit></IconEdit>
			</span>
			<input
				type="number"
				placeholder="Number input field."
				class="input input-bordered input-xs"
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
