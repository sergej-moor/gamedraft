import { defineStore } from "pinia";
import Template from "../classes/Template";
import {
  Attribute,
  AttributeType,
  BooleanField,
  ImageField,
  NumberField,
  TextField,
  createNewAttribute,
} from "~~/classes/Attributes";
import Entry from "~~/classes/Entry";
import Breadcrumb from "~~/classes/Breadcrumb";
import {
  AttributeInstance,
  createNewInstance,
} from "~~/classes/AttributeInstances";

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
  selectedTemplateCache: Template | null;
  selectedParentsCache: Template[] | null;
  uniqueAttributes: Map<number, Attribute>;
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
    selectedTemplateCache: null,
    selectedParentsCache: null,
    uniqueAttributes: new Map<number, Attribute>(),
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
          state.selectedTemplateCache &&
          state.selectedTemplateCache.id === targetId
        )
          return state.selectedTemplateCache;

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
     */
    searchTemplates:
      (state) =>
      (
        searchQuery: string,
        includeInstanceValues?: boolean,
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

          if (includeInstanceValues) {
            const entries = current?.entries.find((entry) =>
              entry.instances.find((instance) =>
                searchTags.find((tag) =>
                  instance.getValue() instanceof String
                    ? caseSensitiveSearch
                      ? instance.getValue().includes(tag)
                      : instance
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
     * @returns First value is entry with empty AttributeInstances, second are those instances
     */
    getEmptyInstances(state): [Entry, AttributeInstance[]][] | undefined {
      const stack: Template[] = [];
      const result: [Entry, AttributeInstance[]][] = [];
      stack.push(state.root);

      while (stack.length > 0) {
        const current = stack.pop();

        current?.entries.forEach((entry) => {
          const emptyFields: AttributeInstance[] = [];
          emptyFields.push(
            ...entry.instances.filter((instance) => !instance.getValue())
          );

          if (emptyFields.length) result.push([entry, emptyFields]);
        });

        if (current?.children.length) stack.push(...current.children);
      }

      return result;
    },
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
      )
        throw new Error(
          `Selected Template has children! Add to children instead!`
        );

      const newEntry = new Entry(
        `newEntry (${this.lastEntryId + 1})`,
        ++this.lastEntryId
      );

      const parentAttributes: Attribute[] =
        this.getParentsOfCurrent?.flatMap((parent) => parent.attributes) ?? [];
      const totalAttributes: Attribute[] = parentAttributes.concat(
        this.currentTemplate?.attributes ?? []
      );
      const newInstances: AttributeInstance[] =
        totalAttributes.map((attribute) => createNewInstance(attribute)) ?? [];

      newEntry.instances.push(...newInstances);
      this.currentTemplate!.entries.push(newEntry);
      return true;
    },

    setSelectedEntryId(id: number) {
      this.selectedEntryId = id;
      // console.log("set selectedEntry ID to " + this.selectedEntryId);

      this.showContentEditor = true;
    },

    /**
     * @todo Use this to update the position of attributes
     * Deprecated
     */
    updateAttributeInstances() {
      // const stack: Template[] = [];
      // stack.push(this.currentTemplate!);
      // while (stack.length > 0) {
      //   const current = stack.pop();
      //   current?.entries?.forEach((entry) => {
      //     const newInstances: AttributeInstance[] = [];
      //     current?.attributes.forEach((attribute) => {
      //       const match = entry.instances.find(
      //         (instances) => instances.getParent() === attribute
      //       );
      //       if (match) {
      //         newInstances.push(match);
      //       } else {
      //         newInstances.push(attribute);
      //       }
      //     });
      //     entry.setAttributes(newInstances);
      //   });
      //   if (current?.children.length) stack.push(...current.children);
      // }
    },

    /**
     * Deletes an Entry with the specified id
     * @param targetId Id of the Entry to be deleted
     */
    deleteEntryById(targetId: number) {
      const stack: Template[] = [];
      stack.push(this.root);

      while (stack.length > 0) {
        const current = stack.pop();

        const targetIndex =
          current?.entries.findIndex((entry) => entry.id === targetId) ?? -1;
        if (targetIndex >= 0) return current?.entries.splice(targetIndex, 1)[0];

        if (current?.children.length) stack.push(...current.children);
      }

      throw new Error(`Couldn't find Entry with id: ${targetId}!`);
    },

    // wichtig: number-attribute haben einen min und max-wert, auf den geclampt werden muss wenn der gesetzt ist

    /* --------------- ATTRIBUTE SECTION --------------- */

    setSelectedAttributeId(id: number) {
      this.selectedAttributeId = id;
    },

    /**
     * Creates a new Attribute ot the given type
     * Automatically creates a matching instance on every dependent entry
     * @param type Type of Attribute
     * @param name Name of the Attribute, reverts to "newAttribute (id)" if left out
     */
    addAttribute(type: AttributeType) {
      const newAttribute = createNewAttribute(
        `newAttribute (${this.lastAttributeId + 1})`,
        ++this.lastAttributeId,
        type
      );

      this.currentTemplate!.attributes.push(newAttribute);
      this.uniqueAttributes.set(newAttribute.getId(), newAttribute);

      const stack: Template[] = [];
      stack.push(this.currentTemplate!);
      while (stack.length > 0) {
        const current = stack.pop();

        // Can't have entries if it has children
        if (current?.children.length) stack.push(...current.children);
        else if (current?.entries)
          current.entries.forEach((entry) =>
            entry.instances.push(createNewInstance(newAttribute))
          );
      }
    },

    /**
     * Deletes an Attribute with a specific ID from the template tree
     * Automatically removes any instances that have it as their parent
     * @param targetId ID of the Attribute to be deleted
     */
    deleteAttribute(targetId: number) {
      const target = this.currentTemplate!.attributes.findIndex(
        (attribute) => attribute.getId() === targetId
      );

      if (target === -1)
        throw new Error(`Couldn't find Attribute with id: ${targetId}!`);

      const removed = this.currentTemplate!.attributes.splice(target, 1).pop();
      this.uniqueAttributes.delete(removed!.getId());

      const stack: Template[] = [];
      stack.push(this.currentTemplate!);
      while (stack.length > 0) {
        const current = stack.pop();

        // Can't have entries if it has children
        if (current?.children.length) stack.push(...current.children);
        else if (current?.entries)
          current.entries.forEach((entry) =>
            entry.setAttributeInstances(
              entry.instances.filter(
                (instance) => instance.getParent() !== removed
              )
            )
          );
      }
    },

    /**
     * Tests whether an attribute name has already been taken on this branch, then sets it as the new name if not
     * @param targetId Id of the attribute to be renamed
     * @param newName new name of that attribute
     */
    updateAttributeName(targetId: number, newName: string): boolean {
      let nameTaken = false;
      let target: Attribute | undefined;

      this.getParentsOfCurrent
        ?.flatMap((parent) => parent.attributes)
        .concat(this.currentTemplate?.attributes ?? [])
        .forEach((attribute) => {
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
      this.updateAttributeName(this.selectedAttributeId, newName);
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
     * @param newEntryParent a sibling object that will adopt the deleted template's entries
     * @returns whether opperation was successfull
     */
    deleteTemplateById(
      targetId: number,
      adoptGrandChildren?: boolean,
      mergeAttributesDown?: boolean,
      newEntryParent?: Template
    ): boolean {
      const stack: Template[] = [];
      stack.push(this.root);

      while (stack.length > 0) {
        const current = stack.pop();

        if (current?.id === targetId) {
          const parents = this.getParentsOfTemplateById(targetId);

          if (newEntryParent)
            newEntryParent.entries.push(...this.currentTemplate!.entries);

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
     * @todo proper error handling
     * @todo verify data to prevent outside tempering causing issues
     * @param json String representing an object tree
     */
    parseJsonToTemplateTree(json: string) {
      const parseAttributes = (data: any[]): Attribute[] => {
        return data.map((parsedAttribute: any) => {
          let newField: Attribute;
          switch (parsedAttribute.type) {
            case AttributeType.TEXT_FIELD:
              newField = new TextField(
                parsedAttribute.name,
                parsedAttribute.id,
                parsedAttribute.minLength,
                parsedAttribute.maxLength,
                parsedAttribute.unique
              );
              break;
            case AttributeType.NUMBER_FIELD:
              newField = new NumberField(
                parsedAttribute.name,
                parsedAttribute.id,
                parsedAttribute.minValue,
                parsedAttribute.maxValue,
                parsedAttribute.stepSize,
                parsedAttribute.suffix
              );
              break;
            case AttributeType.BOOLEAN_FIELD:
              newField = new BooleanField(
                parsedAttribute.name,
                parsedAttribute.id
              );
              break;
            case AttributeType.IMAGE_FIELD:
              newField = new ImageField(
                parsedAttribute.name,
                parsedAttribute.id
              );
              break;
            default:
              newField = new NumberField(
                parsedAttribute.name,
                parsedAttribute.id
              );
          }
          this.uniqueAttributes.set(newField.getId(), newField);
          return newField;
        });
      };

      const parseAttributeInstances = (data: any[]): AttributeInstance[] => {
        return data.map((parsedInstance: any) => {
          const parent = this.uniqueAttributes.get(parsedInstance.parentId);

          if (!parent || !(parent instanceof AttributeInstance)) {
            throw new Error(
              `Failed to retrieve parent attribute for instance with parentId: ${parsedInstance.parentId}`
            );
          }

          return createNewInstance(parent, parsedInstance.value);
        });
      };

      const parseEntries = (data: any[]): Entry[] => {
        return data.map((parsedEntry: any) => {
          const entry = new Entry(parsedEntry.name, parsedEntry.id);
          entry.setAttributeInstances(
            parseAttributeInstances(parsedEntry.instances)
          );
          return entry;
        });
      };

      const parseChildren = (data: any[]): Template[] => {
        return data.map((parsedChild: any) => {
          const child = new Template(parsedChild.name, parsedChild.id);
          child.attributes = parseAttributes(parsedChild.attributes);
          child.entries = parseEntries(parsedChild.entries);
          child.children = parseChildren(parsedChild.children);
          return child;
        });
      };

      const parseTemplate = (data: any): Template => {
        const template = new Template(data.name, data.id);
        template.attributes = parseAttributes(data.attributes);
        template.entries = parseEntries(data.entries);
        template.children = parseChildren(data.children);
        return template;
      };

      const data = JSON.parse(json);
      this.root = parseTemplate(data);
      console.log(this.root);
    },

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
