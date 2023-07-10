<template lang="">
  <div class="form-control flex my-1">
    <div class="flex">
      <!-- @todo fix magic number -->
      <EntryEditorAttributeNumberInput
        v-if="attribute.getType() == 1"
        :title="attribute.getName()"
        :input-val="attribute.getValue()"
      />
      <!-- @todo fix magic number -->
      <EntryEditorAttributeTextInput
        v-if="attribute.getType() == 0"
        :title="attribute.getName()"
        :input-val="attribute.getValue()"
      />
      <div v-else>Unknown Attribute type called {{ attribute.getType() }}</div>
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
