import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuRafComponent } from './menu-raf.component';

describe('MenuRafComponent', () => {
  let component: MenuRafComponent;
  let fixture: ComponentFixture<MenuRafComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MenuRafComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MenuRafComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
