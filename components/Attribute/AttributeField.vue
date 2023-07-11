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
      <AttributeText
        v-if="attribute.getType() == 0"
        :title="attribute.getName()"
        @update-title="updateAttributeTitle"
      />
      <AttributeNumber
        v-else-if="attribute.getType() == 1"
        :title="attribute.getName()"
        @update-title="updateAttributeTitle"
      />
      <AttributeBoolean
        v-else-if="attribute.getType() == 2"
        :title="attribute.getName()"
      />
      <AttributeImage
        v-else-if="attribute.getType() == 3"
        :title="attribute.getName()"
        @update-title="updateAttributeTitle"
      />
      <div v-else>Unknown Attribute Type called {{ attribute.getType() }}</div>
      <AttributeDeleteButton
        class="justify-self-end"
        @delete-attribute="handleDelete()"
      >
      </AttributeDeleteButton>
    </div>
  </div>
</template>

<script setup>
import { Attribute } from "~~/classes/Attributes";
import { useTemplateStore } from "~~/stores/template";
const store = useTemplateStore();

const { updateAttributeName } = store;

const props = defineProps({
  attribute: {
    type: Attribute,
    default() {
      return {};
    },
  },
});
const attribute = toRef(props, "attribute");

const id = ref(attribute.value.getId());

const handleDelete = ref(() => {
  store.deleteAttribute(id.value);
});

function updateAttributeTitle(newTitle) {
  store.setSelectedAttributeId(id.value);
  updateAttributeName(id.value, newTitle);
}

function setAttributeId() {
  store.setSelectedAttributeId(id.value);
}

function isSelectedAttribute() {
  return store.selectedAttributeId === id.value;
}
</script>