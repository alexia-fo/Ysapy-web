import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerPedidosEnviadosComponent } from './ver-pedidos-enviados.component';

describe('VerPedidosEnviadosComponent', () => {
  let component: VerPedidosEnviadosComponent;
  let fixture: ComponentFixture<VerPedidosEnviadosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VerPedidosEnviadosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerPedidosEnviadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
