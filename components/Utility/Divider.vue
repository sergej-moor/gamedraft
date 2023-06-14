<template>
	<div class="flex gap-1">
		<UtilityVisibilityToggle :visible="true"></UtilityVisibilityToggle>
		<slot></slot>
		<div class="w-full flex flex-col justify-center">
			<div class="border-b-2 border-b-gray-200 w-full h-0"></div>
		</div>
	</div>
</template>
<script>
	export default {};
</script>
<style lang=""></style>
