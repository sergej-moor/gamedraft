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
        <EntryAttribute :attribute="attribute" />
      </li>
    </ol>
  </div>
</template>
<script setup>
const props = defineProps({
  name: String,
  id: Number,
  attributes: Array,
});

const name = toRef(props, "name");
/* const id = toRef(props, "id"); */
const attributes = toRef(props, "attributes");
</script>
<style lang=""></style>
