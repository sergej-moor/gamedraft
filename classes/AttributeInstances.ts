import {
  Attribute,
  AttributeType,
  BooleanField,
  ImageField,
  NumberField,
  TextField,
} from "./Attributes";

function createNewInstance(parent: Attribute, value?: any): AttributeInstance {
  switch (parent.getType()) {
    case AttributeType.TEXT_FIELD:
      return new TextInstance(parent as TextField, value);
    case AttributeType.NUMBER_FIELD:
      return new NumberInstance(parent as NumberField, value);
    case AttributeType.BOOLEAN_FIELD:
      return new BooleanInstance(parent as BooleanField, value);
    case AttributeType.IMAGE_FIELD:
      return new ImageInstance(parent as ImageField, value);
    default:
      throw new Error(`Unknown type of parent id:  ${parent.getId}!`);
  }
}

/** Holds a value that contains information about an entry,
 * and that was defined by an Attribute object
 */
abstract class AttributeInstance {
  abstract getValue(): any;
  abstract setValue(newValue: any): void;
  abstract updateFromParent(): void;
  abstract getParent(): Attribute;
}

class NumberInstance extends AttributeInstance {
  protected parent: NumberField;
  protected value?: number;

  constructor(parent: NumberField, value?: number) {
    super();
    this.parent = parent;
    this.value = value || parent.getDefault();
  }

  updateFromParent(): void {
    if (this.value) {
      const [min, max, stepSize] = this.parent.getValueConstraints();
      if (min) this.value = Math.max(min, this.value);
      if (max) this.value = Math.min(max, this.value);
      if (stepSize) this.value = Math.round(this.value / stepSize) * stepSize;
    } else if (this.parent.getDefault()) this.value = this.parent.getDefault();
  }

  setValue(newValue: number) {
    const [min, max, stepSize] = this.parent.getValueConstraints();
    if (min) newValue = Math.max(min, newValue);
    if (max) newValue = Math.min(max, newValue);
    if (stepSize) newValue = Math.round(newValue / stepSize) * stepSize;
    this.value = newValue;
  }

  getValue(): number | undefined {
    return this.value;
  }

  getParent(): NumberField {
    return this.parent;
  }
}

class TextInstance extends AttributeInstance {
  protected parent: TextField;
  protected value?: string;

  constructor(parent: TextField, value?: string) {
    super();
    this.parent = parent;
    this.value = value || parent.getDefault();
  }

  updateFromParent(): void {}

  setValue(newValue: string) {
    this.value = newValue;
  }

  getValue(): string | undefined {
    return this.value;
  }

  getParent(): TextField {
    return this.parent;
  }
}

class ImageInstance extends AttributeInstance {
  protected parent: ImageField;
  protected value?: string;

  constructor(parent: ImageField, value?: string) {
    super();
    this.parent = parent;
    this.value = value || parent.getDefault();
  }

  updateFromParent(): void {}

  setValue(newValue: string) {
    this.value = newValue;
  }

  getValue(): string | undefined {
    return this.value;
  }

  getParent(): ImageField {
    return this.parent;
  }
}

class BooleanInstance extends AttributeInstance {
  protected parent: BooleanField;
  protected value?: boolean;

  constructor(parent: BooleanField, value?: boolean) {
    super();
    this.parent = parent;
    this.value = value || parent.getDefault();
  }

  updateFromParent(): void {}

  setValue(newValue: boolean) {
    this.value = newValue;
  }

  getValue(): boolean | undefined {
    return this.value;
  }

  getParent(): BooleanField {
    return this.parent;
  }
}

export {
  TextInstance,
  NumberInstance,
  AttributeInstance,
  ImageInstance,
  BooleanInstance,
  createNewInstance,
};
