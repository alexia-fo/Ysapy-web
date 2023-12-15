import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComparacionInventariosComponent } from './comparacion-inventarios.component';

describe('ComparacionInventariosComponent', () => {
  let component: ComparacionInventariosComponent;
  let fixture: ComponentFixture<ComparacionInventariosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ComparacionInventariosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComparacionInventariosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
