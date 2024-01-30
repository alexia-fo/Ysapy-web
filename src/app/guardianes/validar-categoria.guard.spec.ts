import { TestBed } from '@angular/core/testing';

import { ValidarCategoriaGuard } from './validar-categoria.guard';

describe('ValidarCategoriaGuard', () => {
  let guard: ValidarCategoriaGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(ValidarCategoriaGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
