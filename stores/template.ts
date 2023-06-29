import { defineStore } from "pinia";
import Template from "../classes/Template";
import { Attribute } from "~~/classes/Attributes";
import Entry from "~~/classes/Entry";

// import Breadcrumb from "~~/classes/Breadcrumb";

interface State {
  lastEntryId: number;
  lastTemplateId: number;
  lastAttributeId: number;
  selectedEntryId: number;
  selectedTemplateId: number;
  selectedAttributeId: number;
  selectedTabId: number;
  tabs: { id: number; templateId: number; attributeId: number }[];
  showContentEditor: boolean;
  currentTemplateCache: Template | null;
  root: Template;
}

export const useTemplateStore = defineStore("template", {
  persist: {
    storage: persistedState.localStorage,
  },
  state: (): State => ({
    lastEntryId: 1,
    lastTemplateId: 1,
    lastAttributeId: 1,
    selectedEntryId: 1,
    selectedTemplateId: 1,
    selectedAttributeId: -1,
    selectedTabId: 0,
    tabs: [{ id: 0, templateId: 0, attributeId: 0 }],
    showContentEditor: false,
    currentTemplateCache: null,
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
      const getParentsOfTemplate = function (
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
          const branchesToChild = getParentsOfTemplate(current.children[i]);

          if (branchesToChild) return [current, ...branchesToChild];
        }

        return null;
      };

      return getParentsOfTemplate(state.root);
    },

    getParentsOfTemplateById:
      (state) =>
      (targetId: number): Template[] | null => {
        const getParentsOfTemplate = function (
          current: Template
        ): Template[] | null {
          if (current.id === targetId || !current.children.length) return null;

          if (current.children.find((child) => child.id === targetId))
            return [current];

          for (let i = 0; i < current.children.length; i++) {
            const branchesToChild = getParentsOfTemplate(current.children[i]);

            if (branchesToChild) return [current, ...branchesToChild];
          }

          return null;
        };

        return getParentsOfTemplate(state.root);
      },

    /* TODO: getBreadcrumbsOfCurrent
    returns an array similar to getParentsOfCurrent, but also with 
    the currentTemplate and the objects only contain the id and name properties */

    /**
     * Finds the corresponding object for the currently selected template in the template tree
     * @returns object of currently selected template
     */
    currentTemplate: (state): Template | null => {
      const findCurrentTemplate = function (): Template | null {
        if (state.currentTemplateCache?.id === state.selectedTemplateId)
          return state.currentTemplateCache;

        const stack: Template[] = [];
        stack.push(state.root);
        while (stack.length > 0) {
          const current = stack.pop();

          if (current?.id === state.selectedTemplateId) return current;

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
      entry.attributes.push(
        ...(this.getParentsOfCurrent?.flatMap((parent) => parent.attributes) ??
          [])
      );
      entry.attributes.push(...(this.currentTemplate?.attributes ?? []));
      this.currentTemplate!.entries.push(entry);

      // TODO add the attributes from the current template to this contentpage
      // if a default value is set, set it to the inital "value"-prop from the attribute-object
    },

    /**
     * Deletes the currently selected template from the template tree
     * Automatically selects the next sibling
     * @param adoptGrandChildren Whether the direct parent of current should become the new direct parent of currents' children. If false, all children will be deleted too
     * @param inheritAttributes Whether unique attributes of current should be inherited to all children before deletion as to not get lost. If false, attributes (and their values) will be lost
     * @returns whether opperation was successfull
     */
    deleteCurrentTemplate(
      adoptGrandChildren?: boolean,
      inheritAttributes?: boolean
    ): boolean {
      const parents = this.getParentsOfCurrent;

      if (parents) {
        const directParent = parents[parents.length - 1];

        const childIndex = directParent.children.findIndex(
          (child) => child === this.currentTemplate
        );

        const newSelectedId =
          directParent.children.length > 1
            ? directParent.children[childIndex + (childIndex > 0 ? -1 : 1)].id
            : directParent.id;

        const siblings: Template[] = parents[
          parents.length - 1
        ].children.filter((sibling) => sibling !== this.currentTemplate);
        const grandChildren = this.currentTemplate?.children ?? [];

        if (inheritAttributes) {
          grandChildren.forEach((child) => {
            child.attributes.push(...(this.currentTemplate?.attributes ?? []));
          });
        }

        directParent.children = adoptGrandChildren
          ? [...siblings, ...grandChildren]
          : siblings;

        this.selectedTemplateId = newSelectedId;
        return true;
      } else {
        // TODO Add Pop-up for confirmation
        console.error("Cannot delete root template.");
        return false;
      }
    },

    /**
     * Deletes a template from the template tree by its id
     * @param targetId Id of the template to be deleted
     * @param adoptGrandChildren Whether the direct parent of current should become the new direct parent of currents' children. If false, all children will be deleted too
     * @param inheritAttributes Whether unique attributes of current should be inherited to all children before deletion as to not get lost. If false, attributes (and their values) will be lost
     * @returns whether opperation was successfull
     */
    deleteTemplateById(
      targetId: number,
      adoptGrandChildren?: boolean,
      mergeAttributesDown?: boolean
    ): boolean {
      const stack: Template[] = [];
      stack.push(this.root);

      while (stack.length > 0) {
        const current = stack.pop();

        if (current?.id === targetId) {
          const parents = this.getParentsOfTemplateById(targetId);

          if (parents) {
            const siblings: Template[] = parents[
              parents.length - 1
            ].children.filter((child) => child !== current);

            const grandChildren = current.children ?? [];

            if (mergeAttributesDown) {
              grandChildren.forEach((child) => {
                child.attributes.push(...(current.attributes ?? []));
              });
            }

            parents[parents.length - 1].children = adoptGrandChildren
              ? [...siblings, ...grandChildren]
              : siblings;

            return true;
          } else {
            console.error("Cannot delete root template.");
            return false;
          }
        }
        if (current?.children.length) stack.push(...current.children);
      }

      console.error(`Couldn't find template with id: ${targetId}!`);
      return false;
    },

    setselectedEntryId(id: number) {
      this.selectedEntryId = id;
      // console.log("set selectedEntry ID to " + this.selectedEntryId);

      this.showContentEditor = true;
    },

    updateEntryAttributes() {
      // TODO make sure that the content page has the same attributes as the template while remaining the filled in data
      this.selectedEntry.attributes = this.currentTemplate!.attributes;
    },

    // TODO add functions that update the attribute-objects "value"-prop in the current entry
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

    deleteAttribute(attributeId: number) {
      let attributeIndex = -1;
      this.currentTemplate!.attributes.forEach((att, index) => {
        if (att.id === attributeId) {
          attributeIndex = index;
        }
      });

      this.currentTemplate!.attributes.splice(attributeIndex, 1);
    },

    updateAttributeName(attributeId: number, newName: String) {
      this.currentTemplate!.attributes.forEach((att, _index) => {
        if (att.id === attributeId) {
          att.name = newName;
        }
      });
    },

    updateSelectedAttributeName(newName: String) {
      this.currentTemplate!.attributes.forEach((att, _index) => {
        if (att.id === this.selectedAttributeId) {
          att.name = newName;
        }
      });
    },

    /* --- TEMPLATES --- */
    addTemplate() {
      this.lastTemplateId += 1;
      const template = new Template(
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
