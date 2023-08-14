import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AbmcSucursalComponent } from './abmc-sucursal.component';

describe('AbmcSucursalComponent', () => {
  let component: AbmcSucursalComponent;
  let fixture: ComponentFixture<AbmcSucursalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AbmcSucursalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AbmcSucursalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
