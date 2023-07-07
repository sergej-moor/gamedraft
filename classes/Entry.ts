import { Attribute } from "./Attributes";

export default class Entry {
  name: String;
  id: number;
  attributes: Attribute[];

  constructor(name: string, id: number, attributes: Attribute[]) {
    this.name = name;
    this.id = id;
    this.attributes = attributes;
  }

  setAttributes(attributes: Attribute[]) {
    this.attributes = attributes;
  }
}
