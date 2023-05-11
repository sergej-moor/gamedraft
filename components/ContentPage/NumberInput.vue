<template lang="">
	<div>
		<div class="flex-1 w-full">
			<label
				for=""
				class="input-group input-group-xs input-group-vertical w-full m-0"
			>
				<span class="w-full flex p-0">
					<input
						class="w-full input input-sm input-ghost focus:outline-none focus:bg-transparent"
						type="text"
						placeholder="Attribute name"
						:value="title"
						disabled
					/>
				</span>

				<span class="w-full flex p-0">
					<input
						type="text"
						placeholder="Text input field."
						class="input input-bordered input-xs"
						:value="inputVal"
						@input="$emit('updateValue', $event.target.value)"
					/>
					<IconEdit></IconEdit>
				</span>
			</label>
		</div>
	</div>
</template>
<script setup>
	const props = defineProps({
		title: String,
		inputVal: String,
	});

	const title = toRef(props, "title");
	const inputVal = toRef(props, "inputVal");
</script>
<style lang=""></style>
