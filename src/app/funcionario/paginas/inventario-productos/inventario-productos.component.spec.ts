import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventarioProductosComponent } from './inventario-productos.component';

describe('InventarioProductosComponent', () => {
  let component: InventarioProductosComponent;
  let fixture: ComponentFixture<InventarioProductosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InventarioProductosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InventarioProductosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
