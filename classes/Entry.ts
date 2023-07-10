import { Attribute } from "./Attributes";

export default class Entry {
  name: String;
  id: number;
  attributes: Attribute[];

  constructor(name: string, id: number) {
    this.name = name;
    this.id = id;
    this.attributes = [];
  }

  setAttributes(attributes: Attribute[]) {
    this.attributes = attributes;
  }
}
