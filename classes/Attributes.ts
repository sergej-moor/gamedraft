/** Type of Attribute */
enum AttributeType {
  TEXT_FIELD,
  NUMBER_FIELD,
  BOOLEAN_FIELD,
  IMAGE_FIELD,
}

/** Stores information about an entry */
abstract class Attribute {
  /** Unique identifier of the attribute. It is shared with all entry instances */
  id: number;
  /** Name of attribute, does not have to be unique throughout a project, but a template can only hold one with the same name */
  name: string;
  /** Whether setting the value of this attribute is optional */
  protected optional?: boolean;
  protected collapsed?: boolean;

  constructor(name: string, id: number) {
    this.id = id;
    this.name = name;
  }

  abstract setValue(newValue: any): void;
  abstract getValue(): any;
  abstract setDefault(newDefault: any): void;
  abstract getDefault(): any;
  abstract getType(): AttributeType;

  getId(): number {
    return this.id;
  }

  getName(): string {
    return this.name;
  }

  isOptional(): boolean | undefined {
    return this.optional;
  }

  isCollapsed(): boolean | undefined {
    return this.collapsed;
  }

  setName(name: string) {
    this.name = name;
  }

  setOptional(optional: boolean) {
    this.optional = optional;
  }

  setCollapsed(collapsed: boolean) {
    this.collapsed = collapsed;
  }
}

class TextField extends Attribute {
  // @todo make value a dictionary in order to integrate languages

  private type = AttributeType.TEXT_FIELD;
  private default?: string;
  private value?: string;
  /** Whether the value of this attribute should be unique across the project */
  unique?: boolean;

  constructor(name: string, id: number, value?: string) {
    super(name, id);
    this.value = value;
  }

  setValue(newValue: string) {
    this.value = newValue;
  }

  getValue(): string | undefined {
    return this.value;
  }

  getType(): AttributeType {
    return this.type;
  }

  setDefault(newDefault: string): void {
    this.default = newDefault;
  }

  getDefault(): string | undefined {
    return this.default;
  }
}

class NumberField extends Attribute {
  private default?: number;
  private value?: number;
  private type = AttributeType.NUMBER_FIELD;

  private valueRange?: [number, number];
  private steps?: number;
  private Suffix?: string;

  constructor(name: string, id: number, value?: number) {
    super(name, id);
    this.value = value;
  }

  setValue(newValue: number) {
    this.value = newValue;
  }

  getValue(): number | undefined {
    return this.value;
  }

  getType(): AttributeType {
    return this.type;
  }

  setDefault(newDefault: number): void {
    this.default = newDefault;
  }

  getDefault(): number | undefined {
    return this.default;
  }
}

class BooleanField extends Attribute {
  private default?: boolean;
  private value?: boolean;
  private type = AttributeType.BOOLEAN_FIELD;

  constructor(name: string, id: number, value?: boolean) {
    super(name, id);
    this.value = value;
  }

  setValue(newValue: boolean) {
    this.value = newValue;
  }

  getValue(): boolean | undefined {
    return this.value;
  }

  getType(): AttributeType {
    return this.type;
  }

  setDefault(newDefault: boolean): void {
    this.default = newDefault;
  }

  getDefault(): boolean | undefined {
    return this.default;
  }
}

class ImageField extends Attribute {
  private default?: string;
  private value?: string;
  private type = AttributeType.IMAGE_FIELD;

  constructor(name: string, id: number, value?: string) {
    super(name, id);
    this.value = value;
  }

  setValue(newValue: string) {
    this.value = newValue;
  }

  getValue(): string | undefined {
    return this.value;
  }

  getType(): AttributeType {
    return this.type;
  }

  setDefault(newDefault: string): void {
    this.default = newDefault;
  }

  getDefault(): string | undefined {
    return this.default;
  }
}

export {
  Attribute,
  TextField,
  NumberField,
  BooleanField,
  ImageField,
  AttributeType,
};
