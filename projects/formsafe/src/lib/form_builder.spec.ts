import { Validators } from '@angular/forms';
import { TypedFormBuilder } from './form_builder';
import { FormGroupControlConfig, TypedFormControl, TypedFormGroup } from './model';

type WithDisabled<T1, T2> = { [P in Exclude<keyof T1, keyof T2>]: T1[P] } & T2;

export interface InnerType {
  foo: number;
  bar: number;
}

export interface SuperType {
  inner?: InnerType;
}
export interface OuterType extends SuperType {
  name: string;
}

describe('TypedFormBuilderService', () => {
  let fb: TypedFormBuilder;

  beforeEach(() => (fb = new TypedFormBuilder()));

  describe('Typed form array', () => {
    it('should have an array for a form value', () => {
      const test = fb.array<string>([]);
      const value: string[] = test.value;
    });
  });

  describe('Typed form group', () => {
    it('should be able to configure a nullable object property', () => {
      interface Form {
        nullableObject: null | { val: string };
        undefinedObject?: { val: { innerVal: string } };
        undefinedOrNullObject?: null | { val: number };
      }
      type FormConfig = FormGroupControlConfig<Form>;
      const configWithControl: FormConfig = {
        nullableObject: fb.group<{ val: string }>({ val: 'a' }),
        undefinedObject: fb.group<{ val: { innerVal: string } }>({
          val: fb.group({ innerVal: 'b' }),
        }),
        undefinedOrNullObject: fb.group<{ val: number }>({ val: 1 }),
      };
      const group = fb.group(configWithControl);
      expect(group.controls.nullableObject.constructor.name).toEqual('TypedFormGroup');
      expect(group.controls.nullableObject.value).toEqual({ val: 'a' });
      expect(group.controls.undefinedObject.constructor.name).toEqual('TypedFormGroup');
      expect(group.controls.undefinedObject.value).toEqual({ val: { innerVal: 'b' } });
      expect(group.controls.undefinedOrNullObject.constructor.name).toEqual('TypedFormGroup');
      expect(group.controls.undefinedOrNullObject.value).toEqual({ val: 1 });
    });

    it('should be able to configure a nullable array property', () => {
      interface Form {
        nullableArray: null | string[];
        undefinedArray?: number[];
        undefinedOrNullArray?: null | Date[];
      }
      type FormConfig = FormGroupControlConfig<Form>;
      const date = new Date();
      const configWithControl: FormConfig = {
        nullableArray: fb.array(['a']),
        undefinedArray: fb.array([1]),
        undefinedOrNullArray: fb.array([date]),
      };
      const group = fb.group(configWithControl);
      expect(group.controls.nullableArray.value).toEqual(['a']);
      expect(group.controls.undefinedArray.value).toEqual([1]);
      expect(group.controls.undefinedOrNullArray.value).toEqual([date]);
    });

    it('should be able to configure property with a disabled form sate', () => {
      interface Form {
        prop: string;
        undefinedProp?: string;
      }
      type FormConfig = FormGroupControlConfig<Form>;
      const date = new Date();
      const configWithControl: FormConfig = {
        prop: { value: '', disabled: true },
        undefinedProp: { value: undefined, disabled: null },
      };
      const group = fb.group(configWithControl);
      expect(group.controls.prop.value).toEqual('');
      expect(group.controls.undefinedProp.value).toEqual(undefined);
      expect(group.controls.undefinedProp.enabled).toEqual(true);
    });

    it('can patch with partial value', () => {
      const c = fb.group<OuterType>({
        name: null,
        inner: fb.group<InnerType>({
          foo: [1],
          bar: [2],
        }),
      });
      expect(c.value).toEqual({
        name: null,
        inner: {
          foo: 1,
          bar: 2,
        },
      } as any);
      c.patchValue({
        inner: {
          foo: 2,
        },
      });
      expect(c.value as any).toEqual({
        name: null,
        inner: {
          foo: 2,
          bar: 2,
        },
      });
    });

    it('treats Date types as scalar values', () => {
      const ctrl = fb.group<{
        someDate: Date;
      }>({
        someDate: [new Date()],
      });
      expect(ctrl.controls.someDate instanceof TypedFormControl).toBe(true);
    });

    interface FormValueType {
      name: string;
      description?: string;
      address: {
        street: string;
      };
    }

    it('should expect the user to type potentially disabled fields', () => {
      const ctrl = fb.group<WithDisabled<FormValueType, { name?: string }>>({
        name: { value: 'foo', disabled: true },
        description: 'baz',
        address: fb.group({
          street: '123 main',
        }),
      });
      const nameVal: string | null | undefined = ctrl.controls.name.value;
    });

    describe('typical usage', () => {
      let ctrl: TypedFormGroup<FormValueType>;
      afterEach(() => {
        expect(ctrl.controls.name instanceof TypedFormControl).toBe(true);
        expect(ctrl.controls.description instanceof TypedFormControl).toBe(true);
        expect(ctrl.controls.address instanceof TypedFormGroup).toBe(true);
        const value: FormValueType = ctrl.value;
        const nameValue: string | null | undefined = ctrl.controls.name.value;
      });

      describe('initialized with values', () => {
        afterEach(() => {
          expect(ctrl.value).toEqual({
            name: 'bar',
            description: 'baz',
            address: {
              street: '123 main',
            },
          });
        });
        it('can be initialized with property value', () => {
          ctrl = fb.group<FormValueType>({
            name: 'bar',
            description: 'baz',
            address: fb.group<FormValueType['address']>({
              street: '123 main',
            }),
          });
        });

        it('can be initialized with form state', () => {
          ctrl = fb.group<FormValueType>({
            name: {
              value: 'bar',
              disabled: false,
            },
            description: {
              value: 'baz',
              disabled: false,
            },
            address: fb.group<FormValueType['address']>({
              street: {
                value: '123 main',
                disabled: false,
              },
            }),
          });
        });

        it('can be intialized with tuples', () => {
          ctrl = fb.group<FormValueType>({
            name: ['bar'],
            description: ['baz'],
            address: fb.group<FormValueType['address']>({
              street: ['123 main'],
            }),
          });
        });
      });

      describe('initialized with null or undefined', () => {
        afterEach(() => {
          expect(ctrl.value as any).toEqual({
            name: null,
            description: null,
            address: {
              street: null,
            },
          });
        });

        it('can be initialized with null', () => {
          ctrl = fb.group<FormValueType>({
            name: null,
            description: null,
            address: fb.group<FormValueType['address']>({
              street: null,
            }),
          });
        });

        it('', () => {
          interface Input {
            prop: boolean | null;
          }
          type TProp = Input['prop'];
          type TConfig = FormGroupControlConfig<Input>['prop'];

          const input: Input = {} as any;

          const inputGroup = fb.group<Input>({
            prop: [input.prop, Validators.required],
          });
        });

        it('can be initialized with undefined', () => {
          const ct = fb.group<FormValueType>({
            name: undefined,
            description: [undefined],
            address: fb.group<FormValueType['address']>({
              street: null,
            }),
          });
          expect(ct.controls.name.constructor.name).toBe('TypedFormControl');
        });
      });
    });
  });
});
