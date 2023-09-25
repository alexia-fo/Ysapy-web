import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerDetalleRecepcionComponent } from './ver-detalle-recepcion.component';

describe('VerDetalleRecepcionComponent', () => {
  let component: VerDetalleRecepcionComponent;
  let fixture: ComponentFixture<VerDetalleRecepcionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VerDetalleRecepcionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerDetalleRecepcionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
