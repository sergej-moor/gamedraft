<template lang="">
  <div class="bg-gray-400 rounded p-3 m-1" @click="$emit('pressButton')">
    <slot></slot>
  </div>
</template>
<!-- @click="$emit("pressButton")" -->
<script setup>
defineEmits(["pressButton"]);
</script>
<style lang=""></style>
