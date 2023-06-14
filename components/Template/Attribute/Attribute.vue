<template>
	<div
		class="flex my-1 rounded px-1"
		:class="{
			'bg-blue-500': isCurrentAttribute(),
		}"
		@click="setAttributeId()"
	>
		<!-- single line TEXTFIELD  -->
		<div class="flex">
			<TemplateAttributeTextInput
				v-if="attribute.type == 'text'"
				:title="attribute.name"
				@updateTitle="updateAttributeTitle"
			></TemplateAttributeTextInput>
			<TemplateAttributeNumberInput
				v-else-if="attribute.type == 'number'"
				:title="attribute.name"
				@updateTitle="updateAttributeTitle"
			></TemplateAttributeNumberInput>
			<!-- <div v-if="attribute.type == 'text'" class="flex-1 w-full">
				<span class="w-full flex">
					<input
						class="input input-xs input-ghost w-full"
						type="text"
						placeholder="Attribute name"
						:value="title"
						@input="(event) => updateAttributeTitle(event.target.value)"
					/>
					<IconEdit></IconEdit>
				</span>
				<label class="input-group input-group-xs input-group-vertical w-full">
					<input
						type="text"
						placeholder="Text input"
						class="input input-bordered input-xs"
					/>
				</label>
			</div> -->

			<div v-else>Unknown Attribute Type called {{ attribute.type }}</div>
			<TemplateAttributeDeleteButton
				class="justify-self-end"
				@deleteAttribute="handleDelete()"
			></TemplateAttributeDeleteButton>
		</div>
	</div>
</template>

<script setup>
	import { Attribute } from "~~/helpers/attributeClasses";
	import { useTemplateStore } from "~~/stores/template";
	const templateStore = useTemplateStore();

	const { updateAttributeName } = templateStore;

	const props = defineProps({
		attribute: Attribute,
	});
	const attribute = toRef(props, "attribute");

	const id = ref(attribute.value.id);
	const emit = defineEmits(["delete", "update:title"]);
	const handleDelete = ref(() => {
		emit("delete", attribute.value.id);
	});

	function updateAttributeTitle(newTitle) {
		templateStore.setCurrentAttributeId(id.value);
		updateAttributeName(id.value, newTitle);
	}

	function setAttributeId() {
		templateStore.setCurrentAttributeId(id.value);
	}

	function isCurrentAttribute() {
		return templateStore.currentAttributeId == id.value;
	}
</script>
