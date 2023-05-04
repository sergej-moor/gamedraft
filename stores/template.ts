import { defineStore, acceptHMRUpdate } from 'pinia';
import {Template} from '../helpers/templateClass';
import { Attribute } from '~~/helpers/attributeClasses';


export const useTemplateStore = defineStore('template',{
    state: () => ({
        
        counter: 0,
        lastTemplateId: 1,
        lastAttributeId: 1,
        currentTemplateId: 1,
        currentAttributeId: -1,
        currentTabId: 0,
        tabs:[
            {id:0,
            templateId:0,
        attributeId:0}
        ],

        root: new Template("rootTemplate", 1),
    }),
    getters: {
        rootTemplate: (state): Template =>{
            return state.root;
        },

        

        flattenTemplateTree: (state) : Boolean => {
            function getTemplates(template:Template[]):Template[]{
                let childTemplates:Template[] = [];
                const flattenMembers = template.map(t => {
                  if (t.childTemplates && t.childTemplates.length) {
                    childTemplates = [...childTemplates, ...t.childTemplates];
                  }
                  return t;
                });
              
                return flattenMembers.concat(childTemplates.length ? getTemplates(childTemplates) : childTemplates);
              };
   
            return true;
        },
        currentTemplate: (state) : Template | null => {
         

            let findTemplateById = function(template:Template,id:number):Template | null{
                let templateCopy = null;
    
                if (template.id == id) return template;
    
                if (template.childTemplates && template.childTemplates.length) {
                    template.childTemplates.forEach((templ) => {
                        let foundTemp = findTemplateById(templ,id);
                        
                        if (foundTemp){
                            templateCopy = foundTemp;
                            //templateCopy.name = "sssalatsose"+id.toString();
                            /* foundTemp.name="salatsose"+id.toString();
                            console.log("found: ");
                            console.log(foundTemp);
                            console.log("\n"); */
                            return foundTemp;
                        } 
                    })
                    
                }
                if (templateCopy != null) return templateCopy;
                return null;
                
                
            }
    
            return findTemplateById(state.root,state.currentTemplateId);
            },
         currentAttribute(state): Attribute {
            let attributeFound = new Attribute("default");
                this.currentTemplate!.attributes.forEach((att:Attribute) => {
                    console.log(att);
                    if (att.id === state.currentAttributeId){
                        attributeFound = att;
                     
                        return att;
                    }
                });
           
                return attributeFound;
            
        },



        

    },
    actions: {
        /* --- ATTRIBUTES --- */
        addAttribute(attribute:Attribute){
            this.lastAttributeId += 1;
            attribute.setId(this.lastAttributeId);
            attribute.name = attribute.type+"Attribute"+this.lastAttributeId.toString();
            this.currentTemplate!.attributes.push(attribute);
           

        },
        deleteAttribute(attributeId:Number){
            let attributeIndex = -1;
            this.currentTemplate!.attributes.forEach((att,index) => {
                if (att.id === attributeId){
                    attributeIndex = index;
                }
            });
    
            this.currentTemplate!.attributes.splice(attributeIndex,1);
    
        },
        updateAttributeName(attributeId:Number,newName:String){
            this.currentTemplate!.attributes.forEach((att,index) => {
                if (att.id === attributeId){
                    att.name = newName;
               
                }
            });
        },
        updateCurrentAttributeName(newName:String){
            this.currentTemplate!.attributes.forEach((att,index) => {
                if (att.id === this.currentAttributeId){
                    att.name = newName;
               
                }
            });
        },

        /* TABS */
        switchTab(newTabIndex:number){
            console.log(newTabIndex);

        },

        addNewTab(){

        },

        /* --- TEMPLATES --- */
        addTemplate(){
            this.lastTemplateId += 1;
            let template = new Template("Template_"+this.lastTemplateId, this.lastTemplateId);
            this.currentTemplate!.childTemplates.push( template);
        },
        setCurrentTemplateId(id:number){
            this.currentTemplateId = id;
            console.log("current template id: " + id);
        },
        overwriteTemplate(oldId: number, newTemplate:Template){
            /*
            Traverse through the Tree, until the id is found.
            Update the props according to newTemplate
            exit the loop

            */
        },

        
        updateCurrentTemplateName(newName:String){
            this.currentTemplate!.name = newName;
        },
        updateCurrentTemplate(newTemplate:Template){
            let updateTemplate = function(oldTemplate:Template,newTemplate:Template){
                oldTemplate.name = newTemplate.name;
                oldTemplate.attributes = newTemplate.attributes;

            }

            var findTemplateById = function(template:Template,id:number):Template | null{
                let templateCopy = null;
    
                if (template.id == id) return template;
    
                if (template.childTemplates && template.childTemplates.length) {
                    template.childTemplates.forEach((templ) => {
                        let foundTemp = findTemplateById(templ,id);
                        
                        if (foundTemp){
                            templateCopy = foundTemp;
                            templateCopy.name = "sssalatsose"+id.toString();
                            /* foundTemp.name="salatsose"+id.toString();
                            console.log("found: ");
                            console.log(foundTemp);
                            console.log("\n"); */
                            return foundTemp;
                        } 
                    })
                    
                }
    
                return templateCopy;
                
                
            }

        },


    }
})

/* export const useTemplateStore = defineStore({
    id: 'template',
    state: () => ({
        template: new Template("rootTemplate"),
    }),
    getters: {
        rootTemplate: (state): Template =>{
            return state.template;
        }
    },
    actions:{

    }


}) */