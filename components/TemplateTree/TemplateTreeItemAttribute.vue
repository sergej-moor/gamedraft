<template>
  <div :style="ind">
    <a
      :class="{
        link: true,
        flex: true,
        'link-hover': true,
        'link-secondary': isSelectedAttribute(),
      }"
      @click="setAttributeId()"
    >
      <IconTextAttribute v-if="type == 'text'"></IconTextAttribute>
      <IconNumberAttribute v-if="type == 'number'"></IconNumberAttribute>
      <div class="self-center ml-1">{{ name }}</div></a
    >
  </div>
</template>
<script setup>
import { useTemplateStore } from "@/stores/template";
const templateStore = useTemplateStore();

const props = defineProps({
  name: { type: String, default: "" },
  type: { type: String, default: "" },
  id: { type: Number, default: -1 },
  depth: { type: Number, default: -1 },
});

const name = toRef(props, "name");
const type = toRef(props, "type");
const depth = toRef(props, "depth");
const ind = ref({ transform: `translate(${depth.value * 20 + 25}px)` });

function setAttributeId() {
  templateStore.setSelectedAttributeId(props.id);
}

function isSelectedAttribute() {
  return templateStore.selectedAttributeId === props.id;
} /* 
	let isSelectedAttribute = ref(templateStore.selectedAttributeId == props.id); */
</script>
<style lang="scss">
svg {
  display: inline;
}
</style>
