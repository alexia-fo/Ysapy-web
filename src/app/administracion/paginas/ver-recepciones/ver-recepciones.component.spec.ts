import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerRecepcionesComponent } from './ver-recepciones.component';

describe('VerRecepcionesComponent', () => {
  let component: VerRecepcionesComponent;
  let fixture: ComponentFixture<VerRecepcionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VerRecepcionesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerRecepcionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
