import {
  AbstractControl,
  AbstractControlOptions,
  AsyncValidatorFn,
  FormArray,
  FormControl,
  FormGroup,
  ValidatorFn,
} from '@angular/forms';
import { Observable } from 'rxjs';

// Only used for patching form groups
type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends Array<infer U>
    ? Array<DeepPartial<U>>
    : T[P] extends ReadonlyArray<infer U>
    ? ReadonlyArray<DeepPartial<U>>
    : DeepPartial<T[P]>;
};

type Scalars = Date;

export class TypedFormControl<T> extends FormControl {
  public readonly value!: T | null | undefined;
  public readonly valueChanges!: Observable<T | null | undefined>;
  constructor(
    formState: FormState<T> = null,
    validatorOrOpts?: ValidatorFn | ValidatorFn[] | AbstractControlOptions | null,
    asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[] | null
  ) {
    super(formState, validatorOrOpts, asyncValidator);
  }

  setValue(
    value: T | undefined | null,
    options?: {
      onlySelf?: boolean;
      emitEvent?: boolean;
      emitModelToViewChange?: boolean;
      emitViewToModelChange?: boolean;
    }
  ): void {
    super.setValue(value, options);
  }

  patchValue(
    value: T | undefined | null,
    options: {
      onlySelf?: boolean;
      emitEvent?: boolean;
      emitModelToViewChange?: boolean;
      emitViewToModelChange?: boolean;
    } = {}
  ): void {
    super.patchValue(value, options);
  }

  reset(
    formState: FormState<T> = null,
    options: { onlySelf?: boolean; emitEvent?: boolean } = {}
  ): void {
    super.reset(formState, options);
  }
}

export class TypedFormGroup<T> extends FormGroup {
  public readonly value!: T;
  public readonly valueChanges!: Observable<T>;
  public controls!: FormGroupControls<T>;

  constructor(
    controls: { [key in keyof T]: TypedControl<T[key]> },
    options?: ValidatorFn[] | AbstractControlOptions | null,
    asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[] | null
  ) {
    super(controls, options, asyncValidator);
  }

  setValue(value: T, options: { onlySelf?: boolean; emitEvent?: boolean } = {}): void {
    super.setValue(value, options);
  }

  patchValue(
    value: DeepPartial<T>,
    options: { onlySelf?: boolean; emitEvent?: boolean } = {}
  ): void {
    super.patchValue(value, options);
  }

  reset(value: T | {} = {}, options: { onlySelf?: boolean; emitEvent?: boolean } = {}): void {
    super.reset(value, options);
  }

  getRawValue(): T {
    return super.getRawValue();
  }
}

export class TypedFormArray<T> extends FormArray {
  public readonly value!: T[];
  public readonly valueChanges!: Observable<T[]>;
  constructor(
    controls: AbstractControl[],
    validatorOrOpts?: ValidatorFn | ValidatorFn[] | AbstractControlOptions | null,
    asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[] | null
  ) {
    super(controls, validatorOrOpts, asyncValidator);
  }

  setValue(
    value: T[],
    options?: {
      onlySelf?: boolean;
      emitEvent?: boolean;
      emitModelToViewChange?: boolean;
      emitViewToModelChange?: boolean;
    }
  ): void {
    super.setValue(value, options);
  }

  patchValue(
    value: T[],
    options: {
      onlySelf?: boolean;
      emitEvent?: boolean;
      emitModelToViewChange?: boolean;
      emitViewToModelChange?: boolean;
    } = {}
  ): void {
    super.patchValue(value, options);
  }

  getRawValue(): T[] {
    return super.getRawValue();
  }
}

export type FormState<T> =
  | T
  | null
  | {
      value: T | null;
      disabled: boolean | null;
    };

type TypedControl<T> = NonNullable<T> extends Scalars
  ? TypedFormControl<T>
  : NonNullable<T> extends Array<infer TArrayItem>
  ? TypedFormArray<TArrayItem>
  : NonNullable<T> extends ReadonlyArray<infer TReadonlyArrayItem>
  ? TypedFormArray<TReadonlyArrayItem>
  : T extends object
  ? TypedFormGroup<T>
  : TypedFormControl<T>;

export type FormGroupControls<T> = { [name in keyof T]-?: TypedControl<T[name]> };
export type FormGroupControlConfig<T> = { [key in keyof T]-?: ControlConfig<T[key]> };

export type ControlConfig<T> = NonNullable<T> extends Scalars
  ? FormControlConfig<T>
  : NonNullable<T> extends Array<infer TArrayItem>
  ? TypedFormArray<TArrayItem>
  : NonNullable<T> extends ReadonlyArray<infer TReadonlyArrayItem>
  ? TypedFormArray<TReadonlyArrayItem>
  : T extends object
  ? TypedFormGroup<T>
  : FormControlConfig<T>;

export type FormControlConfig<T> =
  | null
  | TypedFormControl<T>
  | FormState<T>
  | {
      0?: T | null;
      1?: ValidatorFn | ValidatorFn[] | null;
      2?: AsyncValidatorFn | AsyncValidatorFn[] | null;
    };
