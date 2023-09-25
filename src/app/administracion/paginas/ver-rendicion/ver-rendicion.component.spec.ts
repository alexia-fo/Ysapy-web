import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerRendicionComponent } from './ver-rendicion.component';

describe('VerRendicionComponent', () => {
  let component: VerRendicionComponent;
  let fixture: ComponentFixture<VerRendicionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VerRendicionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerRendicionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
