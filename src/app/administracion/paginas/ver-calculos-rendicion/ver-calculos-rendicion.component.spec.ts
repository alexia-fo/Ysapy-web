import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerCalculosRendicionComponent } from './ver-calculos-rendicion.component';

describe('VerCalculosRendicionComponent', () => {
  let component: VerCalculosRendicionComponent;
  let fixture: ComponentFixture<VerCalculosRendicionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VerCalculosRendicionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerCalculosRendicionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
