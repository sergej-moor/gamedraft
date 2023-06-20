<template lang="">
	<div>
		<div class="item-wrapper">
			<div
				v-for="item in items"
				@click.prevent.stop="handleClick($event, item)"
				class="item-wrapper__item"
			>
				{{ item.name }}
			</div>
		</div>

		<!-- Make sure you add the `ref` attribute, as that is what gives you the ability
to open the menu. -->
	</div>
</template>
<script setup>
	import VueSimpleContextMenu from "vue-simple-context-menu";
	import { ref } from "vue";

	const items = [{ name: "halo" }, { name: "welt" }];
	const options = [
		{
			name: "Duplicate",
			slug: "duplicate",
		},
		{
			type: "divider",
		},
		{
			name: "Rename",
			slug: "rename",
		},
		{
			name: "<em>Delete</em>",
			slug: "delete",
		},
	];

	const vueSimpleContextMenu = ref(null);

	function handleClick(event, item) {
		vueSimpleContextMenu.value.showMenu(event, item);
	}

	function optionClicked(event) {
		//window.alert(JSON.stringify(event));
	}
</script>
<style lang=""></style>
