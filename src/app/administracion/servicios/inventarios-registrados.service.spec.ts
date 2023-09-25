import { TestBed } from '@angular/core/testing';

import { InventariosRegistradosService } from './inventarios-registrados.service';

describe('InventariosRegistradosService', () => {
  let service: InventariosRegistradosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InventariosRegistradosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
