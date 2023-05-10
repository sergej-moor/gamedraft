import {Attribute} from "./attributeClasses";

class Template {
	name: String
	attributes: Attribute[]
	childTemplates: Template[]
	id: Number
	

	constructor(name:string, id:Number) {
		this.name = name;
		this.attributes = [];
		this.childTemplates = [];
		this.id = id;
	}

/* 	addAttribute(attribute:Attribute){
		this.attributes.push(attribute);
	}

	removeAttribute(attributeId:Number){
		let attributeIndex = -1;
		this.attributes.forEach((att,index) => {
			if (att.id === attributeId){
				attributeIndex = index;
			}
		});

		this.attributes.splice(attributeIndex,1);

	}

	addTemplate(template:Template){
		if (this.childTemplate == null)
		this.childTemplate = template;
		else{
			console.log("child Template already set")
		}
	}

	removeTemplate(){
		this.childTemplate = null;
	} */

    
}
export  {Template}