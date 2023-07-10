<script setup>
import { ref } from "vue";

defineEmits(["updateTitle"]);
const props = defineProps({
  title: { type: String, default: "" },
  value: { type: undefined, default: null },
});

const title = toRef(props, "title");

const input = ref(null);
const file = ref(null);

function setImage(event) {
  // reader.readAsDataURL();
  file.value = URL.createObjectURL(event.srcElement.files[0]);
}

/* input.value.addEventListener("change", () => {
  file.value = input.value.files[0];
}); */
</script>

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
          @input="$emit('updateTitle', $event.target.value)"
        />
      </span>
      <input
        ref="input"
        type="file"
        class="form-input text-sm bg-gray-200 border-none rounded-sm text-white placeholder-gray-100 px-2 py-1"
        accept="image/jpeg, image/png, image/jpg"
        @change="(event) => setImage(event)"
      />
      <img :src="file" alt="" class="max-h-60 max-w-xs object-contain" />
    </label>
  </div>
</template>
<style lang=""></style>
