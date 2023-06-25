import { Attribute } from "./Attributes";
import Entry from "./Entry";

export default class Template {
  name: String;
  attributes: Attribute[];
  children: Template[];
  entries: Entry[];
  id: Number;

  constructor(name: string, id: Number) {
    this.name = name;
    this.attributes = [];
    this.children = [];
    this.entries = [];
    this.id = id;
  }
}
