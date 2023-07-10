import { Attribute, NumberField, TextField } from "./Attributes";

/** Holds a value that contains information about an entry,
 * and that was defined by an Attribute object
 */
abstract class AttributeInstance {
  protected abstract parent: Attribute;
  protected abstract value?: any;

  abstract getValue(): any;
  abstract setValue(newValue: any): void;
  abstract updateFromParent(): void;
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
    }
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
}

export { TextInstance, NumberInstance, AttributeInstance };
