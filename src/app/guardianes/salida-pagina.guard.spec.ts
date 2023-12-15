import { TestBed } from '@angular/core/testing';

import { SalidaPaginaGuard } from './salida-pagina.guard';

describe('SalidaPaginaGuard', () => {
  let guard: SalidaPaginaGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(SalidaPaginaGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
