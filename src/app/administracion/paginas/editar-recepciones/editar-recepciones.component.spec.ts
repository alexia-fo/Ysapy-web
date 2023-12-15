import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarRecepcionesComponent } from './editar-recepciones.component';

describe('EditarRecepcionesComponent', () => {
  let component: EditarRecepcionesComponent;
  let fixture: ComponentFixture<EditarRecepcionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditarRecepcionesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditarRecepcionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
