<template lang="">
	<div class="btn btn-square m-1" @click="$emit('pressButton')">
		<slot></slot>
	</div>
</template>
<!-- @click="$emit("pressButton")" -->
<script>
	export default {};
</script>
<style lang=""></style>
