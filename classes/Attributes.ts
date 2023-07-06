class Attribute {
  id: number;
  name: string;
  value?: any;
  type?: string;
  optional?: boolean;
  collapsed?: boolean;

  constructor(name: string, id: number) {
    this.id = id;
    this.name = name;
  }

  setOptional(optional: boolean) {
    this.optional = optional;
  }
}

class TextField extends Attribute {
  // @todo make value a dictionary in order to integrate languages

  constructor(name: string, id: number, value?: string) {
    super(name, id);
    this.value = value;
    this.type = "text";
  }
}
class NumberField extends Attribute {
  valueRange?: [number, number];
  default?: number;
  steps?: number;
  Suffix?: string;

  constructor(name: string, id: number, value?: number) {
    super(name, id);
    this.value = value;
    this.type = "number";
  }
}

class BooleanField extends Attribute {
  constructor(name: string, id: number, value?: boolean) {
    super(name, id);
    this.value = value;
    this.type = "boolean";
  }
}

class ImageField extends Attribute {
  constructor(name: string, id: number, value?: string) {
    super(name, id);
    this.value = value;
    this.type = "image";
  }
}

export { Attribute, TextField, NumberField, BooleanField, ImageField };
