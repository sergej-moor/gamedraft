class Attribute {
  id: number;
  name: string;
  value?: any;
  type: string;

  constructor(name: string, id: number) {
    this.id = id;
    this.name = name;
    this.type = "base";
  }

  setId(id: number) {
    this.id = id;
  }
}

class Textfield extends Attribute {
  constructor(name: string, id: number, value?: string) {
    super(name, id);
    this.value = value;
    this.type = "text";
  }
}
class Numberfield extends Attribute {
  constructor(name: string, id: number, value?: number) {
    super(name, id);
    this.value = value;
    this.type = "number";
  }
}

export { Attribute, Textfield, Numberfield };
