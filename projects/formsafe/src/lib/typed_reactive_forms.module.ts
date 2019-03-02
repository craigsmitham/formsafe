import { NgModule } from '@angular/core';
import { TypedFormBuilder } from './form_builder';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [],
  imports: [ReactiveFormsModule],
  exports: [ReactiveFormsModule],
  providers: [TypedFormBuilder]
})
export class TypedReactiveFormsModule {}
