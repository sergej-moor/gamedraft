<template>
  <div class="flex-1 w-full">
    <label class="m-0 flex w-full">
      <span class="flex mr-4">
        <IconEdit></IconEdit>
        <input
          class="form-input text-sm bg-gray-800 border-none w-fit outline-none focus:outline-none px-2 py-1"
          type="text"
          placeholder="Attribute name"
          :value="title"
          :disabled="entry"
          @input="$emit('updateTitle', $event.target.value)"
        />
      </span>
      <input
        type="text"
        placeholder="Text input field."
        class="form-input text-sm bg-gray-200 border-none rounded-sm text-white placeholder-gray-100 px-2 py-1"
        :value="value"
        :disabled="!entry"
        @input="$emit('updateValue', $event.target.value)"
      />
    </label>
  </div>
</template>
<script setup>
defineEmits(["updateTitle", "updateValue"]);
const props = defineProps({
  title: { type: String, default: "" },
  value: { type: undefined, default: null },
  entry: { type: Boolean, default: false },
});
const title = toRef(props, "title");
const value = toRef(props, "value");
const entry = toRef(props, "entry");
</script>
<style lang=""></style>
