<template lang="">
  <div class="form-control flex my-1">
    <div class="flex">
      <EntryNumberInput
        v-if="attribute.type == 'number'"
        :title="attribute.name"
        :inputVal="attribute.value"
      />
      <EntryTextInput
        v-if="attribute.type == 'text'"
        :title="attribute.name"
        :inputVal="attribute.value"
      />
      <div v-else>Unknown Attribute type called {{ attribute.type }}</div>
    </div>
  </div>
</template>
<script setup>
import { Attribute } from "~~/classes/Attributes";

const props = defineProps({
  attribute: Attribute,
});

const attribute = toRef(props, "attribute");
</script>
<style lang=""></style>
~~/classes/Attributes
