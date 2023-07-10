/** Type of Attribute */
enum AttributeType {
  TEXT_FIELD,
  NUMBER_FIELD,
  BOOLEAN_FIELD,
  IMAGE_FIELD,
}

/**
 * A blueprint for an Attribute which does not actually hold the values defined in the entry editor
 * Contains constraints for the value an Attribute can take, as well as a bunch of utility functions
 * For the objects that actually hold the values from the entry editor, checkout AttributeInstance
 */
abstract class Attribute {
  /** @todo For some reason, id and name cannot be private, fix this!
   * Unique identifier of the attribute. It is shared with all entry instances */
  public id: number;
  /** Name of attribute, does not have to be unique throughout a project, but a template can only hold one with the same name */
  public name: string;
  /** Whether setting the value of this attribute is optional */
  protected optional?: boolean;
  /** Value an AttributeInstance will default to uppon construction when set */
  protected defaultValue?: any;

  constructor(name: string, id: number) {
    this.id = id;
    this.name = name;
  }

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

  setName(name: string) {
    this.name = name;
  }

  setOptional(optional: boolean) {
    this.optional = optional;
  }
}

class TextField extends Attribute {
  // @todo make value a dictionary in order to integrate languages
  private maxLength?: string;
  private minLength?: string;
  /** Whether the value of this attribute should be unique across the project */
  unique?: boolean;

  getType(): AttributeType {
    return AttributeType.TEXT_FIELD;
  }

  setDefault(newDefault: string): void {
    this.defaultValue = newDefault;
  }

  getDefault(): string | undefined {
    return this.defaultValue;
  }
}

class NumberField extends Attribute {
  private minValue?: number;
  private maxValue?: number;
  /** Value has to be multiple of this number @todo Add option of predicate for non-linear growth */
  private stepSize?: number;
  private suffix?: string;

  getType(): AttributeType {
    return AttributeType.NUMBER_FIELD;
  }

  getDefault(): number | undefined {
    return this.defaultValue;
  }

  getMinValue(): number | undefined {
    return this.minValue;
  }

  getMaxValue(): number | undefined {
    return this.maxValue;
  }

  getStepSize(): number | undefined {
    return this.stepSize;
  }

  /**
   * @returns Array containing min value, max value and stepSize in that order 
   */
  getValueConstraints(): (number | undefined)[] {
    return [this.minValue, this.maxValue, this.stepSize];
  }

  setDefault(newDefault: number | undefined) {
    if (newDefault) {
      if (this.minValue) newDefault = Math.max(this.minValue, newDefault);
      if (this.maxValue) newDefault = Math.min(this.maxValue, newDefault);
      if (this.stepSize)
        newDefault = Math.round(newDefault / this.stepSize) * this.stepSize;
    }
    this.defaultValue = newDefault;
  }

  /**
   * Sets the mathematical minimum that value can become
   * If stepSize is set, minValue will automatically be set to a multiple of it
   * If clampValues is left out, newMinValue cannot be set to a value higher than the current value or defaultValue
   * @param newMinValue new minimum this value can become
   * @param clampValues Whether value and defaultValue should be adjusted to fit over the new minimum
   * @returns whether the new minimum was successfully set
   */
  setMinValue(newMinValue: number | undefined, clampValues?: boolean): boolean {
    if (newMinValue) {
      if (this.stepSize)
        newMinValue = Math.round(newMinValue / this.stepSize) * this.stepSize;

      if (this.defaultValue && this.defaultValue < newMinValue)
        if (clampValues) this.defaultValue = newMinValue;
        else return false;
    }
    this.minValue = newMinValue;
    return true;
  }

  /**
   * Sets the mathematical maximum that value can become
   * If stepSize is set, maxValue will automatically be set to a multiple of it
   * If clampValues is left out, newMaxValue cannot be set to a value lower than the current value or defaultValue
   * @param newMaxValue new maximum this value can become
   * @param clampValues Whether value and defaultValue should be adjusted to fit under the new Maximum
   * @returns whether the new Maximum was successfully set
   */
  setMaxValue(newMaxValue: number | undefined, clampValues?: boolean): boolean {
    if (newMaxValue) {
      if (this.stepSize)
        newMaxValue = Math.round(newMaxValue / this.stepSize) * this.stepSize;

      if (this.defaultValue && this.defaultValue > newMaxValue)
        if (clampValues) this.defaultValue = newMaxValue;
        else return false;
    }
    this.maxValue = newMaxValue;
    return true;
  }

  /**
   * Sets an absolut number, that this attribute's value has to be a multiple of
   * If adjustValues is left out, newStepSize cannot be set if min- or maxValue are not multiples of it
   * @todo Warn the user before setting adjustValues about the amount of values that will be changed
   * @param newStepSize value of this attribute must be a multiple of this
   * @param adjustValues whether the min-, max- and default value should be adjusted to be a multiple of this
   * @returns Whether the new stepSize was successfully set
   */
  setStepSize(
    newStepSize: number | undefined,
    adjustValues?: boolean
  ): boolean {
    if (newStepSize && newStepSize !== 0) {
      this.stepSize = Math.abs(newStepSize);

      if (this.maxValue && this.maxValue % this.stepSize !== 0)
        if (adjustValues) this.setMaxValue(this.maxValue, true);
        else return false;

      if (this.minValue && this.minValue % this.stepSize !== 0)
        if (adjustValues) this.setMinValue(this.minValue, true);
        else return false;
    } else this.stepSize = undefined;
    return true;
  }
}

class BooleanField extends Attribute {
  getType(): AttributeType {
    return AttributeType.BOOLEAN_FIELD;
  }

  setDefault(newDefault: boolean): void {
    this.defaultValue = newDefault;
  }

  getDefault(): boolean | undefined {
    return this.defaultValue;
  }
}

class ImageField extends Attribute {
  getType(): AttributeType {
    return AttributeType.IMAGE_FIELD;
  }

  setDefault(newDefault: string): void {
    this.defaultValue = newDefault;
  }

  getDefault(): string | undefined {
    return this.defaultValue;
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
