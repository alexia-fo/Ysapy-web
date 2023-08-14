import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerDetalleInventarioComponent } from './ver-detalle-inventario.component';

describe('VerDetalleInventarioComponent', () => {
  let component: VerDetalleInventarioComponent;
  let fixture: ComponentFixture<VerDetalleInventarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VerDetalleInventarioComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerDetalleInventarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
