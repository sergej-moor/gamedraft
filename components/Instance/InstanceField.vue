<template lang="">
  <div class="form-control flex my-1">
    <div class="flex">
      <!-- @todo fix magic numbers -->
      <InstanceTextField
        v-if="instance.getParent().getType() == 0"
        :title="instance.getParent().getName()"
        :value="instance.getValue()"
        @update-value="updateInstanceValue"
      />
      <InstanceNumberField
        v-else-if="instance.getParent().getType() == 1"
        :title="instance.getParent().getName()"
        :value="instance.getValue()"
        @update-value="updateInstanceValue"
      />
      <InstanceBooleanField
        v-else-if="instance.getParent().getType() == 2"
        :title="instance.getParent().getName()"
        :value="instance.getValue()"
        @update-value="updateInstanceValue"
      />
      <InstanceImageField
        v-else-if="instance.getParent().getType() == 3"
        :title="instance.getParent().getName()"
        :value="instance.getValue()"
        @update-value="updateInstanceValue"
      />
      <div v-else>
        Unknown Attribute type called {{ instance.getParent().getType() }}
      </div>
    </div>
  </div>
</template>
<script setup>
import { AttributeInstance } from "~~/classes/AttributeInstances";
import { useTemplateStore } from "~~/stores/template";
const store = useTemplateStore();

const props = defineProps({
  instance: {
    type: AttributeInstance,
    default() {
      return {};
    },
  },
});

const instance = toRef(props, "instance");
const id = ref(instance.value.id);

function updateInstanceValue(newValue) {
  store.setSelectedAttributeId(id.value);
  updateSelectedAttributeValue(id.value, newValue);
}
</script>
<style lang=""></style>
