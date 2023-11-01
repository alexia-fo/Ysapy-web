import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AbmcInformacionComponent } from './abmc-informacion.component';

describe('AbmcInformacionComponent', () => {
  let component: AbmcInformacionComponent;
  let fixture: ComponentFixture<AbmcInformacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AbmcInformacionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AbmcInformacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
