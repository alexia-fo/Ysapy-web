import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisualizarRecepcionesComponent } from './visualizar-recepciones.component';

describe('VisualizarRecepcionesComponent', () => {
  let component: VisualizarRecepcionesComponent;
  let fixture: ComponentFixture<VisualizarRecepcionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VisualizarRecepcionesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VisualizarRecepcionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
