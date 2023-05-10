import {Attribute} from "./attributeClasses";

class ContentPage{
    name: String
    id: Number
    attributes: Attribute[]

    constructor(name:string){
        this.name = name;
        this.id = -1;
        this.attributes = [];
        
    }

    setId(id:Number){ 
		this.id = id;
	}

}

export {ContentPage}