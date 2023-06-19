<template>
	<div
		class="flex flex-col defaultlayout h-screen max-h-screen overflow-scroll text-xs bg-gray-800 text-white"
	>
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

	/* width */
	::-webkit-scrollbar {
		width: 8px;
		height: 8px;
	}

	/* Track */
	::-webkit-scrollbar-track {
		background: #333333;
	}

	/* Handle */
	::-webkit-scrollbar-thumb {
		background: #04395e;
		border-radius: 4px;
	}

	/* Handle on hover */
	::-webkit-scrollbar-thumb:hover {
		background: #007fd4;
	}
</style>
