import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerSalidasComponent } from './ver-salidas.component';

describe('VerSalidasComponent', () => {
  let component: VerSalidasComponent;
  let fixture: ComponentFixture<VerSalidasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VerSalidasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerSalidasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
