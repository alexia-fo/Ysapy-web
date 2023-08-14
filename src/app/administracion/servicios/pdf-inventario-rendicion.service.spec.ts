import { TestBed } from '@angular/core/testing';

import { PdfInventarioRendicionService } from './pdf-inventario-rendicion.service';

describe('PdfInventarioRendicionService', () => {
  let service: PdfInventarioRendicionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PdfInventarioRendicionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
