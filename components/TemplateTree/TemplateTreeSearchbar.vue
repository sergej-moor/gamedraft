<template>
  <div
    class="border-b-2 border-gray-200 relative flex w-full bg-gray-400 text-gray-100"
  >
    <input
      id="searchInput"
      type="text"
      class="bg-gray-400 border-none text-sm p-0 pl-1"
      placeholder="Searchbar"
      @keydown.enter="handleKeyPress"
    />
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke-width="1.5"
      stroke="currentColor"
      class="w-4 h-4 absolute right-1 top-1"
      @click="handleSearch"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
      />
    </svg>
  </div>
</template>

<script>
import { useTemplateStore } from "~~/stores/template";
const store = useTemplateStore();
export default {
  methods: {
    handleSearch() {
      const inputText = document.querySelector("#searchInput").value;
      console.log("Searching for:", inputText);
      console.log(store.searchTemplates(inputText));
    },
    handleKeyPress(event) {
      if (event.key === "Enter") {
        this.handleSearch();
      }
    },
  },
};
</script>

<style lang=""></style>
