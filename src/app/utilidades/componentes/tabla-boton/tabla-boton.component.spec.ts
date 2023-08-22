import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaBotonComponent } from './tabla-boton.component';

describe('TablaBotonComponent', () => {
  let component: TablaBotonComponent;
  let fixture: ComponentFixture<TablaBotonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TablaBotonComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TablaBotonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
