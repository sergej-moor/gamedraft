import {Template} from '../helpers/templateClass';
import { Attribute } from '~~/helpers/attributeClasses';

let findTemplateById = function(template:Template,id:number):Template | null{
    let templateCopy = null;

    if (template.id == id) return template;

    if (template.childTemplates && template.childTemplates.length) {
        template.childTemplates.forEach((templ) => {
            let foundTemp = findTemplateById(templ,id);
            
            if (foundTemp){
                templateCopy = foundTemp;
                //templateCopy.name = "sssalatsose"+id.toString();
            
                return foundTemp;
            } 
        })
        
    }

    return templateCopy;
    
    
}

export {findTemplateById}