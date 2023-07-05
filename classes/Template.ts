import { Attribute } from "./Attributes";
import Entry from "./Entry";

export default class Template {
  name: string;
  attributes: Attribute[];
  // eslint-disable-next-line no-use-before-define
  children: Template[];
  entries: Entry[];
  id: number;

  constructor(name: string, id: number) {
    this.name = name;
    this.id = id;
    this.attributes = [];
    this.children = [];
    this.entries = [];
  }
}
