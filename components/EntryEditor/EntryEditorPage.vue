<template lang="">
  <div class="bg-gray-600 p-2 pl-4 mt-2 rounded h-full overflow-y-scroll">
    <div class="divider">
      <input
        type="text"
        :value="store.selectedEntry.name"
        class="input input-ghost input-xs max-w-xs w-full text-xs text-center"
      />
    </div>

    <div class="w-full text-3xl font-semibold mb-4">
      {{ store.selectedEntry.name }}
    </div>
    <ol>
      <li
        v-for="(attribute, index) in store.selectedEntry.attributes"
        :key="index"
      >
        <AttributeField
          :entry="true"
          :attribute="attribute"
          @delete="deleteAttribute"
        />
      </li>
    </ol>
  </div>
</template>
<script setup>
import { useTemplateStore } from "~~/stores/template";
const store = ref(useTemplateStore());

/* const props = defineProps({
  name: { type: String, default: "" },
  id: { type: Number, default: -1 },
  attributes: {
    type: Array,
    default() {
      return [];
    },
  },
});
 */
/* const name = toRef(props, "name");
/* const id = toRef(props, "id"); 
const attributes = toRef(props, "attributes"); */
</script>
<style lang=""></style>
