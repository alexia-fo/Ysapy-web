import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComparacionRendicionesComponent } from './comparacion-rendiciones.component';

describe('ComparacionRendicionesComponent', () => {
  let component: ComparacionRendicionesComponent;
  let fixture: ComponentFixture<ComparacionRendicionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ComparacionRendicionesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComparacionRendicionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
