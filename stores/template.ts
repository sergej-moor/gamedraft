import { defineStore } from "pinia";
import { Attribute } from "~~/classes/Attributes";
import Template from "../classes/Template";
import Entry from "~~/classes/Entry";

export const useTemplateStore = defineStore("template", {
  persist: {
    storage: persistedState.localStorage,
  },
  state: () => ({
    lastEntryId: 1,
    lastTemplateId: 1,
    lastAttributeId: 1,
    selectedEntryId: 1,
    selectedTemplateId: 1,
    selectedAttributeId: -1,
    currentTabId: 0,
    tabs: [{ id: 0, templateId: 0, attributeId: 0 }],
    showContentEditor: false,

    root: new Template("rootTemplate", 1),
  }),
  getters: {
    rootTemplate: (state): Template => {
      return state.root;
    },

    /**
     * Recursively determines all parent templates of the currently selected template
     * Does not contain the current template itself as that would be redundant
     * @returns parents of current template in ordered array starting with root
     */
    getParentsOfCurrent: (state): Template[] | null => {
      let getParentsOfTemplate = function (
        current: Template
      ): Template[] | null {
        if (current.id === state.selectedTemplateId || !current.children.length)
          return null;

        if (
          current.children.find(
            (child) => child.id === state.selectedTemplateId
          )
        )
          return [current];

        for (let i = 0; i < current.children.length; i++) {
          let branchesToChild = getParentsOfTemplate(current.children[i]);

          if (branchesToChild) return [current, ...branchesToChild];
        }

        return null;
      };

      return getParentsOfTemplate(state.root);
    },

    /**
     * Finds the corresponding object for the currently selected template in the template tree
     * @returns object of currently selected template
     */
    currentTemplate: (state): Template | null => {
      let findCurrentTemplate = function (): Template | null {
        const stack: Template[] = [];
        stack.push(state.root);

        while (stack.length > 0) {
          const current = stack.pop();

          if (current?.id == state.selectedTemplateId) return current;

          if (current?.children.length) stack.push(...current.children);
        }

        console.error(
          `Couldn't find template with id: ${state.selectedTemplateId}!`
        );
        return null;
      };

      return findCurrentTemplate();
    },

    /**
     * @warning Seems like unintended behavior!
     * @returns currently selected Attribute and default attribute if null
     */
    selectedAttribute(state): Attribute {
      return (
        this.currentTemplate?.attributes.find(
          (att) => att.id === state.selectedAttributeId
        ) ?? new Attribute("default")
      );
    },

    /**
     * @warning Seems like unintended behavior!
     * @returns currently selected content page and default page if null
     */
    selectedEntry(state): Entry {
      return (
        this.currentTemplate?.entries.find(
          (page) => page.id === state.selectedEntryId
        ) ?? new Entry("entry")
      );
    },
  },
  actions: {
    /* CONTENT PAGES */

    addEntry(entry: Entry) {
      this.lastEntryId += 1;
      entry.setId(this.lastEntryId);
      entry.name = "entry" + this.lastEntryId.toString();
      this.currentTemplate!.entries.push(entry);

      //TODO add the attributes from the current template to this contentpage
      //if a default value is set, set it to the inital "value"-prop from the attribute-object
    },

    deleteCurrentTemplate(
      deleteChildren?: boolean,
      mergeAttributesDown?: boolean
    ): boolean {
      let parents = this.getParentsOfCurrent;

      if (parents) {
        let siblings: Template[] = parents[parents.length - 1].children.filter(
          (child) => child !== this.currentTemplate
        );
        let children = this.currentTemplate?.children ?? [];

        if (mergeAttributesDown) {
          children.forEach((child) => {
            child.attributes.push(...(this.currentTemplate?.attributes ?? []));
          });
        }

        let newChildren = [...siblings, ...children];
        parents[parents.length - 1].children = deleteChildren
          ? siblings
          : newChildren;

        this.selectedTemplateId = parents[parents?.length - 1].id.valueOf();
        return true;
      } else {
        console.error("Cannot delete root template.");
        return false;
      }
    },

    /* deleteTemplateById(id : Number): boolean {
        const stack : Template[] = [];
        stack.push(this.root);

        while (stack.length > 0) {
            const current = stack.pop();
            //console.log(current);

            if (current?.id == id) {
                let parents = this.getParentsOfCurrent;

                if (parents) {
                    let siblings: Template[] = parents[parents.length - 1].children.filter(child => child !== current);
                    parents[parents.length - 1].children = [...siblings, ...current.children];
                    this.currentTemplateId = parents[parents.length - 1].id.valueOf();
                    return true;
                } else {
                    console.error("Cannot delete root template.");
                    return false;
                }
            }

            if (current?.children.length) 
                stack.push(...current.children);
        }

        console.error(`Couldn't find template with id: ${Number}!`);
        return false;
    }, */

    setselectedEntryId(id: number) {
      this.selectedEntryId = id;
      //console.log("set selectedEntry ID to " + this.selectedEntryId);

      this.showContentEditor = true;
    },

    updateEntryAttributes() {
      //TODO make sure that the content page has the same attributes as the template while remaining the filled in data
      this.selectedEntry.attributes = this.currentTemplate!.attributes;
    },

    //TODO add functions that update the attribute-objects "value"-prop in the current entry
    // wichtig: number-attribute haben einen min und max-wert, auf den geclampt werden muss wenn der gesetzt ist

    /* --- ATTRIBUTES --- */
    setSelectedAttributeId(id: number) {
      this.selectedAttributeId = id;
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

    updateSelectedAttributeName(newName: String) {
      this.currentTemplate!.attributes.forEach((att, index) => {
        if (att.id === this.selectedAttributeId) {
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
      this.currentTemplate!.children.push(template);
    },

    setSelectedTemplateId(id: number) {
      this.selectedTemplateId = id;
      this.showContentEditor = false;
    },

    updateCurrentTemplateName(newName: String) {
      this.currentTemplate!.name = newName;
    },
  },
});
