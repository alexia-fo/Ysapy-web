import { TestBed } from '@angular/core/testing';

import { SalidaProductosService } from './salida-productos.service';

describe('SalidaProductosService', () => {
  let service: SalidaProductosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SalidaProductosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
