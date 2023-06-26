<template>
  <div class="flex gap-1 px-2">
    <UtilityVisibilityToggle
      :visible="visible"
      @toggle-visibility="toggleVisibility"
    ></UtilityVisibilityToggle>
    <slot></slot>
    <div class="w-full flex flex-col justify-center">
      <div class="border-b-2 border-b-gray-200 w-full h-0"></div>
    </div>
  </div>
</template>
<script setup>
const emit = defineEmits(["toggleVisibility"]);
const visible = ref(true);
function toggleVisibility() {
  visible.value = !visible.value;
  emit("toggleVisibility", visible.value);
}
</script>
<style lang=""></style>
