import { TestBed } from '@angular/core/testing';

import { TypedFormBuilderService } from './typed-form-builder.service';

describe('TypedFormBuilderService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TypedFormBuilderService = TestBed.get(TypedFormBuilderService);
    expect(service).toBeTruthy();
  });
});
