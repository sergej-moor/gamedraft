import { defineStore } from "pinia";
import Template from "../classes/Template";
import { Attribute, TextField } from "~~/classes/Attributes";
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
  selectedParentsCache: Template[] | null;
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
    selectedParentsCache: null,
    root: new Template("Root", 1),
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
      const parents = state.selectedParentsCache;
      if (
        parents &&
        parents[parents.length - 1].children.find(
          (child) => child.id === state.selectedTemplateId
        )
      )
        return parents;
      else
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
     * @todo Implement matchAllTags
     * Searches the template tree for templates with names or attribute names which include one of the search tags separated by space, comma or semicolon
     * @param searchQuery The unmodified string containing the search tags
     * @param includeEntryValues whether the values of entries should be searched too
     * @param caseSensitiveSearch whether the search should be case sensitive
     * @param matchAllTags whether a template or entry must match all specified search tags or only at least one
     * @returns Templates and Entries containing the specified search tags
     
    searchTemplates:
      (state) =>
      (
        searchQuery: string,
        includeEntryValues?: boolean,
        caseSensitiveSearch?: boolean
        // matchAllTags?: boolean
      ): (Template | Entry)[] => {
        const searchTags = searchQuery.split(/[\s,;]+/);
        const results: (Template | Entry)[] = [];
        const stack: Template[] = [];

        stack.push(state.root);
        while (stack.length > 0) {
          const current = stack.pop();

          if (
            searchTags.find((tag) =>
              caseSensitiveSearch
                ? current!.name.includes(tag)
                : current!.name.toLowerCase().includes(tag.toLowerCase())
            )
          )
            results.push(current!);
          else if (
            current?.attributes.find((attribute) =>
              searchTags.find((tag) =>
                caseSensitiveSearch
                  ? attribute.getName().includes(tag)
                  : attribute
                      .getName()
                      .toLowerCase()
                      .includes(tag.toLowerCase())
              )
            )
          )
            results.push(current);

          if (includeEntryValues) {
            const entries = current?.entries.find((entry) =>
              entry.attributes.find((attribute) =>
                searchTags.find((tag) =>
                  attribute.getValue() instanceof String
                    ? caseSensitiveSearch
                      ? attribute.getValue().includes(tag)
                      : attribute
                          .getValue()
                          .toLowerCase()
                          .includes(tag.toLowerCase())
                    : false
                )
              )
            );

            results.push(entries!);
          }

          if (current?.children.length) stack.push(...current.children);
        }

        return results;
      },
    */
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
     * @todo Seems like unintended behavior!
     * @returns currently selected Attribute and default attribute if null
     */
    selectedAttribute(state): Attribute {
      return (
        this.currentTemplate?.attributes.find(
          (att) => att.getId() === state.selectedAttributeId
        ) ?? new TextField("Placeholder", -69)
      );
    },

    /**
     * @todo Seems like unintended behavior!
     * @returns currently selected content page and default page if null
     */
    selectedEntry(state): Entry | undefined {
      return (
        this.currentTemplate?.entries.find(
          (page) => page.id === state.selectedEntryId
        ) ?? new Entry("Placeholder", -69)
      );
    },

    /**
     * Iterates over template tree to find any empty value fields on entries, then returns those occurences
     * @returns First value is entry with valueless attributes, second is those attributes
    
    getEmptyValueFields(state): [Entry, Attribute[]][] | undefined {
      const stack: Template[] = [];
      const result: [Entry, Attribute[]][] = [];
      stack.push(state.root);

      while (stack.length > 0) {
        const current = stack.pop();

        current?.entries.forEach((entry) => {
          const emptyFields: Attribute[] = [];
          emptyFields.push(
            ...entry.attributes.filter((attribute) => !attribute.getValue())
          );

          if (emptyFields.length) result.push([entry, emptyFields]);
        });

        if (current?.children.length) stack.push(...current.children);
      }

      return result;
    }, */
  },
  actions: {
    /* --------------- ENTRY SECTION --------------- */

    /**
     * Adds an entry to the current template if it has no children
     * @param entry Entry to be added to the current template
     * @returns whether the current operation was successfull
     */
    addEntry(): boolean {
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

      const newEntry = new Entry(
        `newEntry (${this.lastEntryId + 1})`,
        ++this.lastEntryId
      );

      newEntry.attributes.push(
        ...(this.getParentsOfCurrent?.flatMap((parent) => parent.attributes) ??
          [])
      );

      newEntry.attributes.push(...(this.currentTemplate?.attributes ?? []));
      this.currentTemplate!.entries.push(newEntry);
      return true;
    },

    setSelectedEntryId(id: number) {
      this.selectedEntryId = id;
      // console.log("set selectedEntry ID to " + this.selectedEntryId);

      this.showContentEditor = true;
    },

    /**
     * When called, pushes modifications to Attributes from the current template to all dependant entries
     * Should respect the order determined in the template
     * @todo testing
     */
    updateAttributes() {
      const stack: Template[] = [];
      stack.push(this.currentTemplate!);

      while (stack.length > 0) {
        const current = stack.pop();

        current?.entries?.forEach((entry) => {
          const newAttributes: Attribute[] = [];

          current?.attributes.forEach((templateLevel) => {
            const match = entry.attributes.find(
              (entryLevel) => entryLevel.getId() === templateLevel.getId()
            );

            if (match) {
              match.setName(templateLevel.getName());
              newAttributes.push(match);
            } else {
              newAttributes.push(templateLevel);
            }
          });

          entry.setAttributes(newAttributes);
        });

        if (current?.children.length) stack.push(...current.children);
      }
    },

    /**
     * When called, pushes modifications to Attributes from the current template to all dependant entries
     * Should respect the order determined in the template
     * @todo testing
     */
    updateEntryAttributes() {
      const stack: Template[] = [];
      stack.push(this.currentTemplate!);

      while (stack.length > 0) {
        const current = stack.pop();

        current?.entries?.forEach((entry) => {
          const newAttributes: Attribute[] = [];

          current?.attributes.forEach((templateLevel) => {
            const match = entry.attributes.find(
              (entryLevel) => entryLevel.getId() === templateLevel.getId()
            );

            if (match) {
              match.setName(templateLevel.getName());
              newAttributes.push(match);
            } else {
              newAttributes.push(templateLevel);
            }
          });

          entry.setAttributes(newAttributes);
        });

        if (current?.children.length) stack.push(...current.children);
      }
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

    // wichtig: number-attribute haben einen min und max-wert, auf den geclampt werden muss wenn der gesetzt ist

    /* --------------- ATTRIBUTE SECTION --------------- */

    setSelectedAttributeId(id: number) {
      this.selectedAttributeId = id;
    },

    /**
     * Creates a new Attribute ot the given type
     * @param AttributeType Class of the Attribute
     * @param name Name of the Attribute, reverts to "newName (id)" if left out
     * @param value Value of the Attribute
     */
    addAttribute(
      AttributeType: new (name: string, id: number, value?: any) => Attribute,
      name?: string,
      value?: any
    ) {
      const newAttribute = new AttributeType(
        name || `newAttribute (${this.lastAttributeId + 1})`,
        ++this.lastAttributeId,
        value
      );
      this.currentTemplate!.attributes.push(newAttribute);
    },

    deleteAttribute(attributeId: number) {
      let attributeIndex = -1;
      this.currentTemplate!.attributes.forEach((att, index) => {
        if (att.getId() === attributeId) {
          attributeIndex = index;
        }
      });

      this.currentTemplate!.attributes.splice(attributeIndex, 1);
    },

    updateAttributeNameById(targetId: number, newName: string): boolean {
      let nameTaken = false;
      let target: Attribute | undefined;

      this.currentTemplate!.attributes.forEach((attribute) => {
        if (attribute.getName() === newName) {
          nameTaken = true;
          return;
        }

        if (attribute.getId() === targetId) target = attribute;
      });

      if (target && !nameTaken) {
        target.setName(newName);
        return true;
      }

      console.error(`Name: ${newName} already taken!`);
      return false;
    },

    updateSelectedAttributeName(newName: string) {
      this.updateAttributeNameById(this.selectedAttributeId, newName);
    },

    updateSelectedAttributeValue(newValue: any) {
      console.log(newValue);
      // this.selectedAttribute!.setValue(newValue);
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
     * @param inheritAttributes Whether unique attributes of current should be inherited to all children before deletion. If false, attributes will be lost
     * @param stepParent a sibling object that will adopt the deleted template's entries
     * @returns whether opperation was successfull
     */
    deleteCurrentTemplate(
      adoptGrandChildren?: boolean,
      inheritAttributes?: boolean,
      stepParent?: Template
    ): boolean {
      const parents = this.getParentsOfCurrent;

      // will not delete root
      if (parents) {
        const directParent = parents[parents.length - 1];

        if (stepParent)
          stepParent.entries.push(...this.currentTemplate!.entries);

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
     * @param inheritAttributes Whether unique attributes of current should be inherited to all children before deletion. If false, attributes will be lost
     * @param stepParent a sibling object that will adopt the deleted template's entries
     * @returns whether opperation was successfull
     */
    deleteTemplateById(
      targetId: number,
      adoptGrandChildren?: boolean,
      mergeAttributesDown?: boolean,
      stepParent?: Template
    ): boolean {
      const stack: Template[] = [];
      stack.push(this.root);

      while (stack.length > 0) {
        const current = stack.pop();

        if (current?.id === targetId) {
          const parents = this.getParentsOfTemplateById(targetId);

          if (stepParent)
            stepParent.entries.push(...this.currentTemplate!.entries);

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

    /**
     * Takes a json string, parses it to a template tree, then sets it as the current tree
     * @todo proper error handling when
     * @param json String representing an object tree
    
    parseJsonToTemplateTree(json: string) {
      const deserializeAttributes = (data: any[]): Attribute[] => {
        return data.map((parsedAttribute: any) => {
          switch (parsedAttribute.type) {
            case AttributeType.TEXT_FIELD:
              return new TextField(
                parsedAttribute.getName(),
                parsedAttribute.getId(),
                parsedAttribute.getValue()
              );
            case AttributeType.NUMBER_FIELD:
              return new NumberField(
                parsedAttribute.getName(),
                parsedAttribute.getId(),
                parsedAttribute.getValue()
              );
            case AttributeType.BOOLEAN_FIELD:
              return new BooleanField(
                parsedAttribute.getName(),
                parsedAttribute.getId(),
                parsedAttribute.getValue()
              );
            case AttributeType.IMAGE_FIELD:
              return new ImageField(
                parsedAttribute.getName(),
                parsedAttribute.getId(),
                parsedAttribute.getValue()
              );
            default:
              return new NumberField(
                parsedAttribute.getName(),
                parsedAttribute.getId(),
                parsedAttribute.getValue()
              );
          }
        });
      };

      const deserializeEntries = (data: any[]): Entry[] => {
        return data.map((parsedEntry: any) => {
          const entry = new Entry(parsedEntry.name, parsedEntry.id);
          entry.setAttributes(deserializeAttributes(parsedEntry.attributes));
          return entry;
        });
      };

      const deserializeChildren = (data: any[]): Template[] => {
        return data.map((parsedChild: any) => {
          const child = new Template(parsedChild.name, parsedChild.id);
          child.attributes = deserializeAttributes(parsedChild.attributes);
          child.entries = deserializeEntries(parsedChild.entries);
          child.children = deserializeChildren(parsedChild.children);
          return child;
        });
      };

      const deserializeTemplate = (data: any): Template => {
        const template = new Template(data.name, data.id);
        template.attributes = deserializeAttributes(data.attributes);
        template.entries = deserializeEntries(data.entries);
        template.children = deserializeChildren(data.children);
        return template;
      };

      const data = JSON.parse(json);
      this.root = deserializeTemplate(data);
      console.log(this.root);
    },  */

    setSelectedTemplateId(id: number) {
      this.showContentEditor = false;
      this.selectedTemplateId = id;
      this.selectedParentsCache = this.getParentsOfCurrent;
    },

    updateCurrentTemplateName(newName: string) {
      this.currentTemplate!.name = newName;
    },
  },
});
