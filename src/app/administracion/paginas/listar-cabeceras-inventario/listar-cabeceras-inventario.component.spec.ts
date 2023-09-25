import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarCabecerasInventarioComponent } from './listar-cabeceras-inventario.component';

describe('ListarCabecerasInventarioComponent', () => {
  let component: ListarCabecerasInventarioComponent;
  let fixture: ComponentFixture<ListarCabecerasInventarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListarCabecerasInventarioComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListarCabecerasInventarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
