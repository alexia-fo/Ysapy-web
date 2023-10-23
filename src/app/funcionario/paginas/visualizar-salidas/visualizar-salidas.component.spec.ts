import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisualizarSalidasComponent } from './visualizar-salidas.component';

describe('VisualizarSalidasComponent', () => {
  let component: VisualizarSalidasComponent;
  let fixture: ComponentFixture<VisualizarSalidasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VisualizarSalidasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VisualizarSalidasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
