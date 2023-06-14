<template lang="">
	<div>
		<div class="text-sm my-1 breadcrumbs text-gray-100">
			<ul class="flex">
				<li class="mx-1" v-for="(template, index) in templates" :key="index">
					<span v-if="index != 0"> > </span
					><a class="hover:underline hover:cursor-pointer">{{
						template.title
					}}</a>
				</li>
			</ul>
		</div>
	</div>
</template>
<script setup>
	import { Template } from "~~/helpers/templateClass";
	const props = defineProps({
		templateList: Template,
	});
	const templates = toRef(props, "templateList");
</script>
<style lang=""></style>
