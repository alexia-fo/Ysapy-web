import { TestBed } from '@angular/core/testing';

import { ObtenerPedidosService } from './obtener-pedidos.service';

describe('ObtenerPedidosService', () => {
  let service: ObtenerPedidosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ObtenerPedidosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
