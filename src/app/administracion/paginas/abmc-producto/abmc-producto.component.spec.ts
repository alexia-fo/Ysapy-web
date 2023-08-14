import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AbmcProductoComponent } from './abmc-producto.component';

describe('AbmcProductoComponent', () => {
  let component: AbmcProductoComponent;
  let fixture: ComponentFixture<AbmcProductoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AbmcProductoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AbmcProductoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
