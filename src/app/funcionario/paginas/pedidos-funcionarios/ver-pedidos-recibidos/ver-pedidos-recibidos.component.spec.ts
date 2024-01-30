import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerPedidosRecibidosComponent } from './ver-pedidos-recibidos.component';

describe('VerPedidosRecibidosComponent', () => {
  let component: VerPedidosRecibidosComponent;
  let fixture: ComponentFixture<VerPedidosRecibidosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VerPedidosRecibidosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerPedidosRecibidosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
