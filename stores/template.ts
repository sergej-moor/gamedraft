import { defineStore, acceptHMRUpdate } from "pinia";
import { Template } from "../helpers/templateClass";
import { Attribute } from "~~/helpers/attributeClasses";
import { ContentPage } from "~~/helpers/contentPageClass";

export const useTemplateStore = defineStore("template", {
  persist: {
    storage: persistedState.localStorage,
  },
  state: () => ({
    counter: 0,
    lastTemplateId: 1,
    lastAttributeId: 1,
    currentTemplateId: 1,
    currentAttributeId: -1,
    currentTabId: 0,
    tabs: [{ id: 0, templateId: 0, attributeId: 0 }],
    lastContentPageId: 1,
    currentContentPageId: 1,

    showContentEditor: false,

    root: new Template("rootTemplate", 1),
  }),
  getters: {
    rootTemplate: (state): Template => {
      return state.root;
    },

    getParentsOfCurrent: (state): Template[] | null => {
      let getParentsOfTemplateByID = function (current: Template, id: number): Template[] | null {
        if (current.id == id) return [current];

        if (!current.childTemplates || !current.childTemplates.length) return null;

        for (let i = 0; i < current.childTemplates.length; i++) {
          let branchesToChild = getParentsOfTemplateByID(current.childTemplates[i], id);

          if (branchesToChild) 
            return [current, ...branchesToChild];
        }

        return null;
      };

      return getParentsOfTemplateByID(state.root, state.currentTemplateId);
    },

    /*     flattenTemplateTree: (state): Boolean => {
      function getTemplates(template: Template[]): Template[] {
        let children: Template[] = [];
        const flattenMembers = template.map((t) => {
          if (t.childTemplates && t.childTemplates.length) {
            children = [...children, ...t.childTemplates];
          }
          return t;
        });

        return flattenMembers.concat(
          children.length ? getTemplates(children) : children
        );
      }

      return true;
    }, */

    currentTemplate: (state): Template | null => {
      let findTemplateById = function (
        template: Template,
        id: number
      ): Template | null {
        let templateCopy = null;

        if (template.id == id) return template;

        if (template.childTemplates && template.childTemplates.length) {
          template.childTemplates.forEach((templ) => {
            let foundTemp = findTemplateById(templ, id);

            if (foundTemp) {
              templateCopy = foundTemp;
              return foundTemp;
            }
          });
        }
        if (templateCopy != null) return templateCopy;
        return null;
      };

      return findTemplateById(state.root, state.currentTemplateId);
    },

    currentAttribute(state): Attribute {
      let attributeFound = new Attribute("default");

      this.currentTemplate!.attributes.forEach((att: Attribute) => {
        console.log(att);
        if (att.id === state.currentAttributeId) {
          attributeFound = att;

          return att;
        }
      });

      return attributeFound;
    },

    currentContentPage(state): ContentPage {
      let contentPageFound = new ContentPage("contentPage");

      this.currentTemplate!.contentPages.forEach((page: ContentPage) => {
        //console.log(page);
        if (page.id === state.currentContentPageId) {
          contentPageFound = page;
          return page;
        }
      });
      //console.log("current content Page");
      //console.log(contentPageFound);

      return contentPageFound;
    },
  },
  actions: {
    /* CONTENT PAGES */

    addContentPage(contentPage: ContentPage) {
      this.lastContentPageId += 1;
      contentPage.setId(this.lastContentPageId);
      contentPage.name = "contentPage" + this.lastContentPageId.toString();
      this.currentTemplate!.contentPages.push(contentPage);

      //TODO add the attributes from the current template to this contentpage
      //if a default value is set, set it to the inital "value"-prop from the attribute-object
    },

    setCurrentContentPageId(id: number) {
      this.currentContentPageId = id;
      console.log("set currentcontentPage ID to " + this.currentContentPageId);

      this.showContentEditor = true;
    },

    updateContentPageAttributes() {
      //TODO make sure that the content page has the same attributes as the template while remaining the filled in data
      console.log("Bruh?!");
      this.currentContentPage.attributes = this.currentTemplate!.attributes;
    },

    //TODO add functions that update the attribute-objects "value"-prop in the current contentPage
    // wichtig: number-attribute haben einen min und max-wert, auf den geclampt werden muss wenn der gesetzt ist

    /* --- ATTRIBUTES --- */
    setCurrentAttributeId(id: number) {
      this.currentAttributeId = id;
    },

    addAttribute(attribute: Attribute) {
      this.lastAttributeId += 1;
      attribute.setId(this.lastAttributeId);
      attribute.name =
        attribute.type + "Attribute" + this.lastAttributeId.toString();
      this.currentTemplate!.attributes.push(attribute);
    },

    deleteAttribute(attributeId: Number) {
      let attributeIndex = -1;
      this.currentTemplate!.attributes.forEach((att, index) => {
        if (att.id === attributeId) {
          attributeIndex = index;
        }
      });

      this.currentTemplate!.attributes.splice(attributeIndex, 1);
    },

    updateAttributeName(attributeId: Number, newName: String) {
      this.currentTemplate!.attributes.forEach((att, index) => {
        if (att.id === attributeId) {
          att.name = newName;
        }
      });
    },

    updateCurrentAttributeName(newName: String) {
      this.currentTemplate!.attributes.forEach((att, index) => {
        if (att.id === this.currentAttributeId) {
          att.name = newName;
        }
      });
    },

    /* --- TEMPLATES --- */
    addTemplate() {
      this.lastTemplateId += 1;
      let template = new Template(
        "Template_" + this.lastTemplateId,
        this.lastTemplateId
      );
      this.currentTemplate!.childTemplates.push(template);
    },

    setCurrentTemplateId(id: number) {
      this.currentTemplateId = id;
      this.showContentEditor = false;
    },

    updateCurrentTemplateName(newName: String) {
      this.currentTemplate!.name = newName;
    },
  },
});
