import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerCabecerasInventarioComponent } from './ver-cabeceras-inventario.component';

describe('VerCabecerasInventarioComponent', () => {
  let component: VerCabecerasInventarioComponent;
  let fixture: ComponentFixture<VerCabecerasInventarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VerCabecerasInventarioComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerCabecerasInventarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
