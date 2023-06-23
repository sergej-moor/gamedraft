import {Attribute} from "./Attributes";
import Entry from "./Entry";

export default class Template {
	name: String
	attributes: Attribute[]
	children: Template[]
	entries: Entry[] 
	id: Number

	constructor(name:string, id:Number) {
		this.name = name;
		this.attributes = [];
		this.children = [];
		this.entries = [];
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
		if (this.child == null)
		this.child = template;
		else{
			console.log("child Template already set")
		}
	}

	removeTemplate(){
		this.child = null;
	} */
}