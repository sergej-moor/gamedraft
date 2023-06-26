<template lang="">
  <div>
    <div class="divider">
      <input
        type="text"
        :placeholder="name"
        :value="name"
        class="input input-ghost input-xs max-w-xs w-full text-xs text-center"
      />
    </div>

    <ol>
      <li v-for="(attribute, index) in attributes" :key="index">
        <EntryEditorAttribute :attribute="attribute" />
      </li>
    </ol>
  </div>
</template>
<script setup>
const props = defineProps({
  name: { type: String, default: "" },
  id: { type: Number, default: -1 },
  attributes: {
    type: Array,
    default() {
      return [];
    },
  },
});

const name = toRef(props, "name");
/* const id = toRef(props, "id"); */
const attributes = toRef(props, "attributes");
</script>
<style lang=""></style>
