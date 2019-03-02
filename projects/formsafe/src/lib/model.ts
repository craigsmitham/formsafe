import {
  AbstractControl,
  FormControl,
  FormArray,
  FormGroup,
  AbstractControlOptions,
  ValidatorFn,
  AsyncValidatorFn,
} from '@angular/forms';
import { Observable } from 'rxjs';

// Only used for patching form groups
type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends Array<infer U>
    ? Array<DeepPartial<U>>
    : T[P] extends ReadonlyArray<infer U>
    ? ReadonlyArray<DeepPartial<U>>
    : DeepPartial<T[P]>
};

export type DefaultScalars = Date;

export class TypedFormControl<T> extends FormControl {
  public readonly value!: T;
  public readonly valueChanges!: Observable<T | null | undefined>;
  constructor(
    formState: FormState<T> = null,
    validatorOrOpts?:
      | ValidatorFn
      | ValidatorFn[]
      | AbstractControlOptions
      | null,
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

type TypedGroupControls<T, TScalar> = {
  [name in keyof T]-?: TypedControl<T[name], TScalar>
};

export class TypedFormGroup<T, TScalar = DefaultScalars> extends FormGroup {
  public readonly value!: T;
  public readonly valueChanges!: Observable<T>;
  public controls!: TypedGroupControls<T, TScalar>;

  constructor(
    controls: { [key in keyof T]: TypedControl<T[key], DefaultScalars> },
    options?: ValidatorFn[] | AbstractControlOptions | null,
    asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[] | null
  ) {
    super(controls, options, asyncValidator);
  }

  setValue(
    value: T,
    options: { onlySelf?: boolean; emitEvent?: boolean } = {}
  ): void {
    super.setValue(value, options);
  }

  patchValue(
    value: DeepPartial<T>,
    options: { onlySelf?: boolean; emitEvent?: boolean } = {}
  ): void {
    super.patchValue(value, options);
  }

  reset(
    value: T | {} = {},
    options: { onlySelf?: boolean; emitEvent?: boolean } = {}
  ): void {
    super.reset(value, options);
  }

  getRawValue(): T {
    return super.getRawValue();
  }
}

export class TypedFormArray<T> extends FormArray {
  constructor(
    controls: AbstractControl[],
    validatorOrOpts?:
      | ValidatorFn
      | ValidatorFn[]
      | AbstractControlOptions
      | null,
    asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[] | null
  ) {
    super(controls, validatorOrOpts, asyncValidator);
  }
}

export type FormState<T> =
  | T
  | null
  | undefined
  | {
      value: T | null;
      disabled: boolean | null;
    };

type TypedControl<T, TScalar> = T extends TScalar
  ? TypedFormControl<T>
  : T extends Array<infer T1>
  ? TypedFormArray<T1>
  : T extends ReadonlyArray<infer T2>
  ? TypedFormArray<T2>
  : T extends object
  ? TypedFormGroup<T, TScalar>
  : TypedFormControl<T>;

export type ControlsConfig<T, TScalar> = {
  [key in keyof T]-?: T[key] extends TScalar
    ? (ControlConfig<T[key]> | TypedFormControl<T[key]>)
    : T[key] extends Array<infer T1>
    ? TypedFormArray<T1>
    : T[key] extends ReadonlyArray<infer T2>
    ? TypedFormArray<T2>
    : T[key] extends object
    ? TypedFormGroup<T[key], TScalar>
    : (ControlConfig<T[key]> | TypedFormControl<T[key]>)
};

type ControlConfig<T> =
  | undefined
  | FormState<T>
  | {
      0?: T | null;
      1?: ValidatorFn | ValidatorFn[] | null;
      2?: AsyncValidatorFn | AsyncValidatorFn[] | null;
    }
  | never[];
