<template lang="">
	<div>
		<div class="text-sm breadcrumbs">
			<ul>
				<li v-for="template in templates"><a>template.title</a></li>
			</ul>
		</div>
	</div>
</template>
<script setup>
	const props = defineProps({
		templates: templates,
	});
	const templates = toRef(props, "templates");
</script>
<style lang=""></style>
