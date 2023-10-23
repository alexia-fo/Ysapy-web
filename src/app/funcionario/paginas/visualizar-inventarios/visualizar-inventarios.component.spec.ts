import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisualizarInventariosComponent } from './visualizar-inventarios.component';

describe('VisualizarInventariosComponent', () => {
  let component: VisualizarInventariosComponent;
  let fixture: ComponentFixture<VisualizarInventariosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VisualizarInventariosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VisualizarInventariosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
