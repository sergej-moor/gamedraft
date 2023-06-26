<template>
  <div
    class="flex flex-col defaultlayout h-screen max-h-screen overflow-scroll text-xs bg-gray-800 text-white"
  >
    <UtilityNavBar></UtilityNavBar>
    <div class="page-wrapper h-full flex">
      <UtilitySideBar></UtilitySideBar>
      <slot class="page"> </slot>
    </div>
  </div>
</template>

<style>
@tailwind base;
@tailwind components;
@tailwind utilities;

.btn {
  padding: 0.25rem;
}
input {
}

/* width */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

/* Track */
::-webkit-scrollbar-track {
  background: theme("colors.gray.400");
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: theme("colors.blue.500");
  border-radius: 4px;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: theme("colors.blue.200");
}

/* 	.vue-simple-context-menu{
		&--active{

		}
	} */

/* CONTEXT MENU STYLING */
.vue-simple-context-menu {
  background-color: theme("colors.gray.600");
  /* box-shadow: 0 3px 6px 0 rgba(51, 51, 51, 0.2); */
}

.vue-simple-context-menu__item {
  margin: 0;
  align-items: left;
  color: theme("colors.white");
}
.vue-simple-context-menu__item:hover {
  background-color: theme("colors.blue.500");
}

/* DIALOG STYLING */

dialog::backdrop {
  opacity: 1;
  background-color: rgb(68, 68, 185);
  backdrop-filter: blur(5px);
}

dialog {
  min-width: 300px;
  min-height: 100px;
}
</style>
