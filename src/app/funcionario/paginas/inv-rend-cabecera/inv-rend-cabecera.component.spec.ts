import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvRendCabeceraComponent } from './inv-rend-cabecera.component';

describe('InvRendCabeceraComponent', () => {
  let component: InvRendCabeceraComponent;
  let fixture: ComponentFixture<InvRendCabeceraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvRendCabeceraComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvRendCabeceraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
