import { defineStore, acceptHMRUpdate } from 'pinia';
import {Template} from '../helpers/templateClass';
import { Attribute } from '~~/helpers/attributeClasses';
import { ContentPage } from '~~/helpers/contentPageClass';


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
        lastContentPageId: 1,
        currentContentPageId: 1,

        showContentEditor: false,


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
        /* allTemplatesInCurrentPath: (state) : Template[] => {
            const findPath = (ob:Template, key:PropertyKey) => {
                const path:String[] = [];
                const keyExists = (obj:Template):Boolean => {
                  if (!obj || (typeof obj !== "object" && !Array.isArray(obj))) {
                    return false;
                  }
                  else if (obj.hasOwnProperty(key)) {
                    return true;
                  }
                  else if (Array.isArray(obj)) {
                    let parentKey = path.length ? path.pop() : "";
              
                    for (let i = 0; i < obj.length; i++) {
                      path.push(`${parentKey}[${i}]`);
                      const result = obj[i].keyExists(key);
                      if (result) {
                        return result;
                      }
                      path.pop();
                    }
                  }
                  else {
                    for (const k in obj) {
                      path.push(k);
                      const result = keyExists(obj[k], key);
                      if (result) {
                        return result;
                      }
                      path.pop();
                    }
                  }
                  return false;
                };
              
                keyExists(ob);
              
                return path.join(".");
              }

            return [];
        }, */

        

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
        
        currentContentPage(state): ContentPage {
            let contentPageFound = new ContentPage("contentPage");

            this.currentTemplate!.contentPages.forEach((page:ContentPage) => {
                console.log(page);
                if (page.id === state.currentContentPageId){
                    contentPageFound = page;
                    return page;
                }
            });
            console.log("current content Page");
            console.log(contentPageFound);

            return contentPageFound;
        },



        

    },
    actions: {
        /* CONTENT PAGES */

        addContentPage(contentPage: ContentPage){
            this.lastContentPageId += 1;
            contentPage.setId(this.lastContentPageId);
            contentPage.name = "contentPage"+this.lastContentPageId.toString();
            this.currentTemplate!.contentPages.push(contentPage);
        },

        setCurrentContentPageId(id: number){
            this.currentContentPageId = id;
            console.log(this.currentContentPageId);
            this.showContentEditor = true;
        },

        updateContentPageAttributes(){
            this.currentContentPage.attributes = this.currentTemplate!.attributes;
        },

        /* --- ATTRIBUTES --- */
        setCurrentAttributeId(id:number){
            this.currentAttributeId=id;
        },
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
        /* --- TEMPLATES --- */
        addTemplate(){
            this.lastTemplateId += 1;
            let template = new Template("Template_"+this.lastTemplateId, this.lastTemplateId);
            this.currentTemplate!.childTemplates.push( template);
        },
        setCurrentTemplateId(id:number){
            this.currentTemplateId = id;
            this.showContentEditor = false;
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