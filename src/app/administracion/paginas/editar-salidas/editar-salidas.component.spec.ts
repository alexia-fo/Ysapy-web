import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarSalidasComponent } from './editar-salidas.component';

describe('EditarSalidasComponent', () => {
  let component: EditarSalidasComponent;
  let fixture: ComponentFixture<EditarSalidasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditarSalidasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditarSalidasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
