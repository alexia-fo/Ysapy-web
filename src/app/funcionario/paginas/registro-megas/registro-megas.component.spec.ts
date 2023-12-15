import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroMegasComponent } from './registro-megas.component';

describe('RegistroMegasComponent', () => {
  let component: RegistroMegasComponent;
  let fixture: ComponentFixture<RegistroMegasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegistroMegasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistroMegasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
