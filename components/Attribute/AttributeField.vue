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
        :value="attribute.getValue()"
        :entry="entry"
        @update-title="updateAttributeTitle"
        @update-value="updateAttributeValue"
      />
      <AttributeNumber
        v-else-if="attribute.getType() == 1"
        :title="attribute.getName()"
        :value="attribute.getValue()"
        :entry="entry"
        @update-title="updateAttributeTitle"
        @update-value="updateAttributeValue"
      />

      <AttributeBoolean
        v-else-if="attribute.getType() == 2"
        :title="attribute.getName()"
        :value="attribute.getValue()"
        :entry="entry"
        @update-title="updateAttributeTitle"
        @update-value="updateAttributeValue"
      ></AttributeBoolean>

      <AttributeImage
        v-else-if="attribute.getType() == 3"
        :title="attribute.getName()"
        :value="attribute.getValue()"
        :entry="entry"
        @update-title="updateAttributeTitle"
        @update-value="updateAttributeValue"
      ></AttributeImage>

      <div v-else>Unknown Attribute Type called {{ attribute.getType() }}</div>
      <AttributeDeleteButton
        v-if="!entry"
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
const templateStore = useTemplateStore();

const { updateAttributeNameById } = templateStore;

const props = defineProps({
  attribute: {
    type: Attribute,
    default() {
      return {};
    },
  },
  entry: {
    type: Boolean,
    default: false,
  },
});
const attribute = toRef(props, "attribute");

const id = ref(attribute.value.id);

const handleDelete = ref(() => {
  templateStore.deleteAttribute(id.value);
});

function updateAttributeTitle(newTitle) {
  templateStore.setSelectedAttributeId(id.value);
  updateAttributeNameById(id.value, newTitle);
}

function updateAttributeValue(newValue) {
  templateStore.setSelectedAttributeId(id.value);
  updateSelectedAttributeValue(id.value, newValue);
}

function setAttributeId() {
  templateStore.setSelectedAttributeId(id.value);
}

function isSelectedAttribute() {
  return templateStore.selectedAttributeId === id.value;
}
</script>
