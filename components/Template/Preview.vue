<template>
  <div
    class="rounded px-2 my-2"
    :class="{
      'bg-gray-600': !activated,
    }"
  >
    <UtilityDivider @toggleVisibility="toggleVisibility">
      <input
        type="text"
        :placeholder="name"
        :value="name"
        @input="(event) => updateTemplateName(event.target.value)"
        class="bg-gray-600 rounded-sm w-fit text-sm font-semibold border-none px-1 text-black"
      />
    </UtilityDivider>

    <ol class="w-full" v-if="visible">
      <li v-for="attribute in attributes">
        <TemplateAttribute :attribute="attribute" @delete="deleteAttribute" />
      </li>
    </ol>
  </div>
</template>
<script setup>
import { useTemplateStore } from "@/stores/template";

const props = defineProps({
  attributes: Array,
  name: String,
  activated: Boolean,
});
const name = toRef(props, "name");
const templateStore = useTemplateStore();

function deleteAttribute(id) {
  templateStore.deleteAttribute(id);
}

function updateTemplateName(newName) {
  templateStore.updateCurrentTemplateName(newName);
}

let visible = ref(true);
function toggleVisibility(isVisible) {
  console.log(isVisible);
  visible.value = isVisible;
}

const attributes = toRef(props, "attributes");
</script>
<style lang=""></style>
