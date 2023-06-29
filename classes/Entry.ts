import { Attribute } from "./Attributes";

export default class Entry {
  name: String;
  id: number;
  attributes: Attribute[];

  constructor(name: string) {
    this.name = name;
    this.id = -1;
    this.attributes = [];
  }

  setId(id: number) {
    this.id = id;
  }
}
