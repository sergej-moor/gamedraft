import { defineStore } from "pinia";
import Template from "../classes/Template";
import { Attribute } from "~~/classes/Attributes";
import Entry from "~~/classes/Entry";
import Breadcrumb from "~~/classes/Breadcrumb";

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
  selectedElementCache: Template | Entry | null;
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
    selectedElementCache: null,
    root: new Template("rootTemplate", 1),
  }),

  getters: {
    rootTemplate: (state): Template => {
      return state.root;
    },

    /**
     * Finds the corresponding object for the currently selected template in the template tree
     * @returns object of currently selected template
     */
    currentTemplate: (state): Template | null => {
      return useTemplateStore().getTemplateById(state.selectedTemplateId);
    },

    /**
     * Returns the corresponding object for a template specified by an id
     * @param targetId id of the template to be returned
     * @returns template with specified id if found, null if not
     */
    getTemplateById:
      (state) =>
      (targetId: number): Template | null => {
        if (
          state.selectedElementCache &&
          state.selectedElementCache instanceof Template &&
          state.selectedElementCache.id === targetId
        )
          return state.selectedElementCache;

        const stack: Template[] = [];
        stack.push(state.root);
        while (stack.length > 0) {
          const current = stack.pop();

          if (current?.id === targetId) return current;

          if (current?.children.length) stack.push(...current.children);
        }

        console.error(`Couldn't find template with id: ${targetId}!`);
        return null;
      },

    /**
     * Recursively determines all parent templates of the currently selected template
     * Does not contain the current template itself as that would be redundant
     * @returns parents of current template in ordered array starting with root
     */
    getParentsOfCurrent: (state): Template[] | null => {
      return useTemplateStore().getParentsOfTemplateById(
        state.selectedTemplateId
      );
    },

    /**
     * Recursively determines all parent templates of a specific template by its id
     * Does not contain the template itself as that would be redundant
     * @param targetId Id of the template which parents should be returned
     * @returns parents of a template in ordered array starting with root
     */
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

    /**
     * Returns the parents starting at root and the current template as an array of breadcrumb
     * objects which only contain the name and id of the templates
     * @returns array of simple breadcrum objects containing name and Id
     */
    getBreadcrumbsOfCurrent: (): Breadcrumb[] | undefined => {
      const store = useTemplateStore();
      const current = store.currentTemplate;
      const parents = store.getParentsOfCurrent;
      return (parents || [])
        .concat(current ? [current] : [])
        .map((template) => new Breadcrumb(template.id, template.name));
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
    /* --------------- ENTRY SECTION --------------- */

    /**
     * Adds an entry to the current template if it has no children
     * @param entry Entry to be added to the current template
     * @returns whether the current operation was successfull
     */
    addEntry(entry: Entry): boolean {
      // @todo - Add Pop-up for whether the entry should be added to the oldest child
      if (
        this.currentTemplate?.children &&
        this.currentTemplate.children.length
      ) {
        console.error(
          `Selected Template has children! Add to children instead!`
        );
        return false;
      }

      this.lastEntryId += 1;
      entry.setId(this.lastEntryId);
      entry.name = "entry" + this.lastEntryId.toString();
      entry.attributes.push(
        ...(this.getParentsOfCurrent?.flatMap((parent) => parent.attributes) ??
          [])
      );
      entry.attributes.push(...(this.currentTemplate?.attributes ?? []));
      this.currentTemplate!.entries.push(entry);
      return true;
    },

    setSelectedEntryId(id: number) {
      this.selectedEntryId = id;
      // console.log("set selectedEntry ID to " + this.selectedEntryId);

      this.showContentEditor = true;
    },

    updateEntryAttributes() {
      // @todo - make sure that the content page has the same attributes as the template while remaining the filled in data
      this.selectedEntry.attributes = this.currentTemplate!.attributes;
    },

    /**
     * Deletes an Entry with the specified id from the template tree and returns it
     * @param targetId Id of the Entry to be deleted
     * @returns deleted Entry if found, otherwise undefined
     */
    deleteEntryById(targetId: number): Entry | undefined {
      const stack: Template[] = [];
      stack.push(this.root);

      while (stack.length > 0) {
        const current = stack.pop();

        const targetIndex =
          current?.entries.findIndex((entry) => entry.id === targetId) ?? -1;
        if (targetIndex >= 0) return current?.entries.splice(targetIndex, 1)[0];

        if (current?.children.length) stack.push(...current.children);
      }

      console.error(`Couldn't find Entry with id: ${targetId}!`);
      return undefined;
    },

    // @todo - add functions that update the attribute-objects "value"-prop in the current entry
    // wichtig: number-attribute haben einen min und max-wert, auf den geclampt werden muss wenn der gesetzt ist

    /* --------------- ATTRIBUTE SECTION --------------- */

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

    /* --------------- TEMPLATE SECTION --------------- */

    /**
     * Adds a template as child to the currently selected template
     */
    addTemplate() {
      this.lastTemplateId += 1;
      const newChild = new Template(
        "Template_" + this.lastTemplateId,
        this.lastTemplateId
      );
      const current = this.currentTemplate;
      newChild.entries = current!.entries.splice(0, current!.entries.length);
      this.currentTemplate!.children.push(newChild);
    },

    /**
     * Deletes the currently selected template from the template tree then automatically selects the next sibling
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
        // @todo - Add Pop-up for deletion settings
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

    setSelectedTemplateId(id: number) {
      this.selectedTemplateId = id;
      this.showContentEditor = false;
    },

    updateCurrentTemplateName(newName: String) {
      this.currentTemplate!.name = newName;
    },
  },
});
