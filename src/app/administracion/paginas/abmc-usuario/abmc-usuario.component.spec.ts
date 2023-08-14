import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AbmcUsuarioComponent } from './abmc-usuario.component';

describe('AbmcUsuarioComponent', () => {
  let component: AbmcUsuarioComponent;
  let fixture: ComponentFixture<AbmcUsuarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AbmcUsuarioComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AbmcUsuarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
