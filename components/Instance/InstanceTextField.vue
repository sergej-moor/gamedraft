<template lang="">
  <div class="flex-1 w-full">
    <label class="m-0 flex w-full">
      <span class="flex mr-4">
        <input
          class="w-full input input-sm input-ghost focus:outline-none focus:bg-transparent"
          type="text"
          placeholder="Attribute name"
          :value="title"
          disabled
        />
      </span>

      <span class="w-full flex p-0">
        <input
          type="text"
          placeholder="Text"
          class="input input-bordered input-xs"
          :value="value"
          @input="$emit('updateValue', $event.target.value)"
        />
        <IconEdit />
      </span>
    </label>
  </div>
</template>
<script setup>
defineEmits(["updateValue"]);
const props = defineProps({
  title: { type: String, default: "" },
  value: { type: undefined, default: null },
});

const title = toRef(props, "title");
const value = toRef(props, "value");
</script>
<style lang=""></style>
