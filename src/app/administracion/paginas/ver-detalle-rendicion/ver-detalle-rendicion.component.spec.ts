import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerDetalleRendicionComponent } from './ver-detalle-rendicion.component';

describe('VerDetalleRendicionComponent', () => {
  let component: VerDetalleRendicionComponent;
  let fixture: ComponentFixture<VerDetalleRendicionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VerDetalleRendicionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerDetalleRendicionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
