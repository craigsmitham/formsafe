import { Injectable } from '@angular/core';
import {
  FormBuilder,
  AbstractControlOptions,
  ValidatorFn,
  AsyncValidatorFn
} from '@angular/forms';
import {
  ControlsConfig,
  TypedFormGroup,
  TypedFormControl,
  TypedFormArray,
  FormState
} from './model';

@Injectable()
export class TypedFormBuilder extends FormBuilder {
  private readonly _fb: FormBuilder;
  constructor() {
    super();
    this._fb = new FormBuilder();
    this._fb.control = this.control;
  }

  group<T = any>(
    controlsConfig: ControlsConfig<T>,
    options?:
      | AbstractControlOptions
      | {
          [key: string]: any;
        }
      | null
  ): TypedFormGroup<T> {
    const { controls, updateOn, validator, asyncValidator } = this._fb.group(
      controlsConfig,
      options
    );

    return new TypedFormGroup<T>(controls as any, {
      asyncValidators: asyncValidator,
      validators: validator,
      updateOn
    });
  }

  control<T = any>(
    formState: FormState<T>,
    validatorOrOpts?:
      | ValidatorFn
      | ValidatorFn[]
      | AbstractControlOptions
      | null,
    asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[] | null
  ): TypedFormControl<T> {
    return new TypedFormControl<T>(formState, validatorOrOpts, asyncValidator);
  }

  array<T>(
    controlsConfig: any[],
    validatorOrOpts?:
      | ValidatorFn
      | ValidatorFn[]
      | AbstractControlOptions
      | null,
    asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[] | null
  ): TypedFormArray<T> {
    const ctrl = this._fb.array(
      controlsConfig,
      validatorOrOpts,
      asyncValidator
    );
    return new TypedFormArray<T>(ctrl.controls, {
      asyncValidators: ctrl.asyncValidator,
      updateOn: ctrl.updateOn,
      validators: ctrl.validator
    });
  }
}
