import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PruebaTablaBotonComponent } from './prueba-tabla-boton.component';

describe('PruebaTablaBotonComponent', () => {
  let component: PruebaTablaBotonComponent;
  let fixture: ComponentFixture<PruebaTablaBotonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PruebaTablaBotonComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PruebaTablaBotonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
