<template>
	<div class="">
		<!-- 		<div class="divider">
			<input
				type="text"
				:placeholder="name"
				:value="name"
				@input="(event) => updateTemplateName(event.target.value)"
				class="max-w-xs w-full text-xs text-center"
			/>
		</div> -->

		<input
			type="text"
			:placeholder="name"
			:value="name"
			@input="(event) => updateTemplateName(event.target.value)"
			class="bg-gray-800 rounded-sm max-w-xs w-full text-xl"
		/>

		<!-- 		<UtilityDivider>
			<input
				type="text"
				:placeholder="name"
				:value="name"
				@input="(event) => updateTemplateName(event.target.value)"
				class="bg-gray-200 rounded-sm max-w-xs w-full text-xs text-center"
			/>
		</UtilityDivider> -->

		<ol class="w-full">
			<li v-for="attribute in attributes">
				<TemplateAttribute
					:attribute="attribute"
					@delete="deleteAttribute"
				></TemplateAttribute>
			</li>
		</ol>

		<UtilityDivider></UtilityDivider>
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
