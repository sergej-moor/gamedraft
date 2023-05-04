<template lang="">
	<div class="w-auto bg-slate-700 flex flex-col sidebar">
		<UtilitySidebarButton @pressButton="firstAction"
			><svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke-width="1.5"
				stroke="currentColor"
				class="w-6 h-6"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"
				/>
			</svg>
		</UtilitySidebarButton>
		<UtilitySidebarButton @pressButton="importTemplate()"
			><svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke-width="1.5"
				stroke="currentColor"
				class="w-6 h-6"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
				/>
			</svg>
		</UtilitySidebarButton>
		<UtilitySidebarButton @pressButton="exportTemplate()"
			><svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke-width="1.5"
				stroke="currentColor"
				class="w-6 h-6"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
				/>
			</svg>
		</UtilitySidebarButton>

		<!-- <input type="file" name="uploadfile" id="" @change="" /> -->
	</div>
</template>

<script setup>
	import download from "downloadjs";
	import { useTemplateStore } from "~~/stores/template";
	const templateStore = useTemplateStore();

	function firstAction() {
		console.log("do some stuff");
	}

	function exportTemplate() {
		console.log("export template");

		download(
			JSON.stringify(templateStore.root),
			"templatetree.txt",
			"text/plain"
		);
	}

	function importTemplate() {
		let newRootTemplate;
		templateStore.root = newRootTemplate;
	}
</script>
<style>
	.sidebar {
		min-height: 100%;
	}
</style>
