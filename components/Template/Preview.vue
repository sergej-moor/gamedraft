<template>
	<div class="bg-gray-600 p-2 mt-2 rounded">
		<!-- 		<div class="divider">
			<input
				type="text"
				:placeholder="name"
				:value="name"
				@input="(event) => updateTemplateName(event.target.value)"
				class="max-w-xs w-full text-xs text-center"
			/>
		</div> -->

		<TemplateBreadcrumb :templateList="templateList"></TemplateBreadcrumb>

		<div class="w-full text-3xl font-semibold">Template</div>

		<UtilityDivider>
			<input
				type="text"
				:placeholder="name"
				:value="name"
				@input="(event) => updateTemplateName(event.target.value)"
				class="bg-gray-600 rounded-sm w-fit text-sm border-none px-1"
			/>
		</UtilityDivider>

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

	const templateList = [{ title: "Sword" }, { title: "Katana" }];
</script>
<style lang=""></style>
