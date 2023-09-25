import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerDetalleSalidaComponent } from './ver-detalle-salida.component';

describe('VerDetalleSalidaComponent', () => {
  let component: VerDetalleSalidaComponent;
  let fixture: ComponentFixture<VerDetalleSalidaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VerDetalleSalidaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerDetalleSalidaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
