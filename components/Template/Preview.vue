<template>
	<div class="">
		<div class="divider">
			<input
				type="text"
				:placeholder="name"
				:value="name"
				@input="(event) => updateTemplateName(event.target.value)"
				class="input input-ghost input-xs max-w-xs w-full text-xs text-center"
			/>
		</div>
		<ol>
			<li v-for="attribute in attributes">
				<TemplateAttribute
					:attribute="attribute"
					@delete="deleteAttribute"
				></TemplateAttribute>
			</li>
		</ol>
	</div>
</template>
<script setup>
	import { useTemplateStore } from "@/stores/template";

	const props = defineProps({
		attributes: Array,
		name: String,
	});
	const name = toRef(props, "name");
	const templateStore = useTemplateStore();

	function deleteAttribute(id) {
		templateStore.deleteAttribute(id);
	}

	function updateTemplateName(newName) {
		templateStore.updateCurrentTemplateName(newName);
		console.log(newName);
	}

	const attributes = toRef(props, "attributes");
</script>
<style lang=""></style>
