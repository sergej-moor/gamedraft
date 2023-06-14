<template>
	<button class="m-1 flex justify-center content-center">
		<svg
			v-if="expanded"
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
			stroke-width="1.5"
			stroke="currentColor"
			class="w-5 h-5"
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				d="M19.5 8.25l-7.5 7.5-7.5-7.5"
			/>
		</svg>

		<svg
			v-else
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
			stroke-width="1.5"
			stroke="currentColor"
			class="w-5 h-5"
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				d="M8.25 4.5l7.5 7.5-7.5 7.5"
			/>
		</svg>
	</button>
</template>
<script setup>
	const props = defineProps({
		expanded: Boolean,
	});

	const expanded = toRef(props, "expanded");
</script>
<style lang="scss">
	path {
		color: white;
	}
</style>
