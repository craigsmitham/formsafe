# FormSafe

![build status](https://img.shields.io/azure-devops/build/craigsmitham/oss/1/master.svg) ![tests](https://img.shields.io/azure-devops/tests/craigsmitham/oss/1/master.svg)

## Typed Reactive Forms for Angular

### Summary

This proof of concept is intended to demonstrate how a typed API for Angular forms could be introduced. It aims to add strong typing in the most high value scenarios. It's informed by years of Angular development with both complex form models and large applications with many forms.

### POC Approach

This proof-of-concept is implemented by subclassing the Angular Forms model. It is primarily intended to demonstrate and assess the feasibility and desireablity of an approach that meets the stated goals.

- POC implementation: typed-forms.ts
- Usage examples: typed-forms-example-usage.ts

### Philosophy

- _The API should enforce the creation/configuration of controls for all known properties, even if the value type proprties are potentially null or undefined._ Undefined proprties are very common in application model types, but far more often than not, it would be an error to assume that a control should not be defined for the type of a type for a given form. Doing this also ensures that strongly typed access to child controls are never undefined, preventing noisy null checks.
- _Instead of reflecting the value of the form as a deep partial of the form value type, the value should always be represented as value type._ If a form is invalid or has disabled controls, it's form value may not be accurately reflected by the form type. The proper approach for the user of the API is to adjust type of the form to reflect potential null or disabled values and/or check the validity/status of the form control(s) prior to accessing values if there is a concern about possible null references. The API should not make a sweeping assumption that the user has not properly typed their form. If a value is represented as a deep partial, then it imposes an undue burden (especially if care has been taken to properly type the form) when consuming the exposed form avlue type.

### Goals

- #### Use types to enforce and assist correct form configuration
  - Ensuring a form contains controls that match the structure of a type is a high value scenario.
  - Applications frequently have forms that match the shape of REST resource, GraphQL mutation, etc. As these types evolve, bugs can easily be introduced into applications that do not ensure the forms match the updated API.
  - Having a strongly typed form configuration increases the likelyhood that correct values are mapped from a data source to the initial form value.
  - Expected value: HIGH
  - POC Notes: TypedFormBuilder and FormControl/Group constructors demonstarte a possible typing approach.
- #### Leverage type information to allow for narrowly typed validators
  - Implementing validators frequently requires asserting the type of both the control and value.
  - Being able to define validators with the expected type of the control and its value streamlines most implementations.
  - Expected value: MEDIUM/LOW
  - POC Notes: Not currently implemented
- #### Provide strongly typed access to child controls
  - Components/validators/etc frequently need access to specific child controls for orchestrating interactions or observing values.
  - The TypedFormGroup dem
  - Expected value: HIGH
- #### Backwards compatible
- #### Viable approach for adoption in future of @angular/forms
  - This type of capability seems like a natural fit for a future version of @angular/forms.

## Non-goals

- #### Exhaustive type safety
  - Many functions/methos (ie. set/get etc) are more suited to dynamic/un-typed scenarios and do not need to be typed.
  - If the controls provides strongly typed access to form children, that should be good enough for most scenarios.
