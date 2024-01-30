import { TestBed } from '@angular/core/testing';

import { RegistrarPedidoService } from './registrar-pedido.service';

describe('PedidoFuncionarioService', () => {
  let service: RegistrarPedidoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RegistrarPedidoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
