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
    
}
export  {Template}