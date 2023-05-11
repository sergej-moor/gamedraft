<template lang="">
	<div>
        <div class="divider">

            <input type="text" :placeholder="name" :value="name" class="input input-ghost input-xs max-w-xs w-full text-xs text-center"
			>

        </div>

        <ol>
            <li v-for="attribute in attributes">
                <ContentPageAttribute :attribute="attribute"></ContentPageAttribute>
            </li>
        </ol>
    </div>

</template>
<script setup>
	import { useTemplateStore } from "@/stores/template";
	import { Attribute } from "~~/helpers/attributeClasses";
	const templateStore = useTemplateStore();

	const props = defineProps({
		name: String,
		id: Number,
		attributes: Array,
	});
</script>
<style lang=""></style>
