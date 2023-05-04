<template lang="">
	<div class="">
		<TemplatePreview
			:attributes="templateStore.currentTemplate.attributes"
			:name="templateStore.currentTemplate.name"
		>
		</TemplatePreview>
	</div>
</template>
<script setup>
	import { useTemplateStore } from "~~/stores/template";
	const templateStore = ref(useTemplateStore());

	//let attributes = ref();

	function printChildren() {
		templateStore.getCurrentTemplateById;
	}
	function getTemplate() {
		console.log(templateStore.currentTemplate);
		//attributes = templateStore.currentTemplate.attributes;
	}
</script>
<!-- <script>
	import { useTemplateStore } from "@/stores/template";

	export default {
		props: {
			attributes: { type: Array },
		},

		setup() {
			const templateStore = useTemplateStore();
			/* 
                const deleteAttribute = ref(
        
                    function (id) {
                        templateStore.deleteAttribute(id);
                    }); */
			function deleteAttribute(id) {
				templateStore.deleteAttribute(id);
			}

			/*       console.log(templateStore.rootTemplate); */

			/*             function convertAttributestoComponents() {
                        let attributes = templateStore.rootTemplate.attributes;
                        attributes.forEach((val, index) => {
                            console.log(val);
                            switch (val) {
            
                            }
                        })
                    } */
			/* 
                convertAttributestoComponents(); */

			return {
				templateStore,
				deleteAttribute,
				/*     convertAttributestoComponents: convertAttributestoComponents(), */
			};
		},
	};
</script> -->
