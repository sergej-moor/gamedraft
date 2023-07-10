import { AttributeInstance } from "./AttributeInstances";

export default class Entry {
  name: String;
  id: number;
  instances: AttributeInstance[];

  constructor(name: string, id: number) {
    this.name = name;
    this.id = id;
    this.instances = [];
  }

  setAttributeInstances(instances: AttributeInstance[]) {
    this.instances = instances;
  }
}
