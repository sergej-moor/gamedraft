<template lang="">
  <div class="form-control flex my-1">
    <div class="flex">
      <EntryEditorAttributeNumberInput
        v-if="attribute.type == 'number'"
        :title="attribute.name"
        :input-val="attribute.value"
      />
      <EntryEditorAttributeTextInput
        v-if="attribute.type == 'text'"
        :title="attribute.name"
        :input-val="attribute.value"
      />
      <div v-else>Unknown Attribute type called {{ attribute.type }}</div>
    </div>
  </div>
</template>
<script setup>
import { Attribute } from "~~/classes/Attributes";

const props = defineProps({
  attribute: {
    type: Attribute,
    default() {
      return {};
    },
  },
});

const attribute = toRef(props, "attribute");
</script>
<style lang=""></style>
