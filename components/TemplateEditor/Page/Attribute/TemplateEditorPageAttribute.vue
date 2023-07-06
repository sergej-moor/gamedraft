<template>
  <div
    class="flex my-1 rounded px-1"
    :class="{
      'bg-blue-500': isSelectedAttribute(),
    }"
    @click="setAttributeId()"
  >
    <!-- single line TextField  -->
    <div class="flex">
      <TemplateEditorPageAttributeTextInput
        v-if="attribute.type == 'text'"
        :title="attribute.name"
        @update-title="updateAttributeTitle"
      />
      <TemplateEditorPageAttributeNumberInput
        v-else-if="attribute.type == 'number'"
        :title="attribute.name"
        @update-title="updateAttributeTitle"
      />

      <div v-else>Unknown Attribute Type called {{ attribute.type }}</div>
      <TemplateEditorPageAttributeDeleteButton
        class="justify-self-end"
        @delete-attribute="handleDelete()"
      >
      </TemplateEditorPageAttributeDeleteButton>
    </div>
  </div>
</template>

<script setup>
import { Attribute } from "~~/classes/Attributes";
import { useTemplateStore } from "~~/stores/template";
const templateStore = useTemplateStore();

const { updateAttributeName } = templateStore;

const props = defineProps({
  attribute: {
    type: Attribute,
    default() {
      return {};
    },
  },
});
const attribute = toRef(props, "attribute");

const id = ref(attribute.value.id);
const emit = defineEmits(["delete", "update:title"]);
const handleDelete = ref(() => {
  emit("delete", attribute.value.id);
});

function updateAttributeTitle(newTitle) {
  templateStore.setSelectedAttributeId(id.value);
  updateAttributeName(id.value, newTitle);
}

function setAttributeId() {
  templateStore.setSelectedAttributeId(id.value);
}

function isSelectedAttribute() {
  return templateStore.selectedAttributeId === id.value;
}
</script>
~~/classes/Attributes
