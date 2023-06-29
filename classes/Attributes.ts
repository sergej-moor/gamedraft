class Attribute {
  id: number;
  name: String;
  value: any;
  type: String;

  constructor(name: String) {
    this.id = -1;
    this.name = name;
    this.type = "base";
  }

  setId(id: number) {
    this.id = id;
  }
}

class Textfield extends Attribute {
  constructor(name: string, value: String) {
    super(name);
    this.value = value;
    this.type = "text";
  }
}
class Numberfield extends Attribute {
  constructor(name: string, value: number) {
    super(name);
    this.value = value;
    this.type = "number";
  }
}

export { Attribute, Textfield, Numberfield };
