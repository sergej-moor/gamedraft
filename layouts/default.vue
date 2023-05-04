<template>
	<div data-theme="forest" class="defaultlayout h-screen overflow-auto text-xs">
		<UtilityNavbar></UtilityNavbar>
		<div class="page-wrapper h-full flex">
			<UtilitySidebar></UtilitySidebar>
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
</style>
