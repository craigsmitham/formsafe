import { TypedFormBuilder } from './form_builder';
import { TypedFormGroup, TypedFormControl } from './model';

type WithDisabled<T1, T2> = { [P in Exclude<keyof T1, keyof T2>]: T1[P] } & T2;

export interface InnerType {
  foo: number;
  bar: number;
}

export interface OuterType {
  inner?: InnerType;
}

describe('TypedFormBuilderService', () => {
  let fb: TypedFormBuilder;

  beforeEach(() => (fb = new TypedFormBuilder()));

  describe('Typed form group', () => {
    it('can patch with partial value', () => {
      const c = fb.group<OuterType>({
        inner: fb.group<InnerType>({
          foo: [1],
          bar: [2],
        }),
      });
      expect(c.value).toEqual({
        inner: {
          foo: 1,
          bar: 2,
        },
      });
      c.patchValue({
        inner: {
          foo: 2,
        },
      });
      expect(c.value).toEqual({
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
      let ctrl = fb.group<WithDisabled<FormValueType, { name?: string }>>({
        name: { value: 'foo', disabled: true },
        description: 'baz',
        address: fb.group({
          street: '123 main',
        }),
      });
      const nameVal: string | undefined = ctrl.controls.name.value;
    });

    describe('typical usage', () => {
      let ctrl: TypedFormGroup<FormValueType>;
      afterEach(() => {
        expect(ctrl.controls.name instanceof TypedFormControl).toBe(true);
        expect(ctrl.controls.description instanceof TypedFormControl).toBe(
          true
        );
        expect(ctrl.controls.address instanceof TypedFormGroup).toBe(true);
        const value: FormValueType = ctrl.value;
        const nameValue: string = ctrl.controls.name.value;
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
          expect(ctrl.value).toEqual({
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

        it('can be initialized with undefined', () => {
          ctrl = fb.group<FormValueType>({
            name: undefined,
            description: [undefined],
            address: fb.group<FormValueType['address']>({
              street: undefined,
            }),
          });
        });
      });
    });
  });
});
