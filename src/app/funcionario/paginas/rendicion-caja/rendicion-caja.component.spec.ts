import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RendicionCajaComponent } from './rendicion-caja.component';

describe('RendicionCajaComponent', () => {
  let component: RendicionCajaComponent;
  let fixture: ComponentFixture<RendicionCajaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RendicionCajaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RendicionCajaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
