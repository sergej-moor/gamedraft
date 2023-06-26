<template>
  <div
    class="rounded px-2 my-2"
    :class="{
      'bg-gray-600': !activated,
    }"
  >
    <UtilityDivider @toggle-visibility="toggleVisibility">
      <input
        type="text"
        :placeholder="name"
        :value="name"
        class="bg-gray-600 rounded-sm w-fit text-sm font-semibold border-none px-1 text-black"
        @input="(event) => updateTemplateName(event.target.value)"
      />
    </UtilityDivider>

    <ol v-if="visible" class="w-full">
      <li v-for="(attribute, index) in attributes" :key="index">
        <TemplateEditorPageAttribute
          :attribute="attribute"
          @delete="deleteAttribute"
        />
      </li>
    </ol>
  </div>
</template>
<script setup>
import { useTemplateStore } from "@/stores/template";

const props = defineProps({
  attributes: {
    type: Array,
    default() {
      return [];
    },
  },
  name: { type: String, default: "Unnamed" },
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

const visible = ref(true);
function toggleVisibility(isVisible) {
  console.log(isVisible);
  visible.value = isVisible;
}

const attributes = toRef(props, "attributes");
</script>
<style lang=""></style>
