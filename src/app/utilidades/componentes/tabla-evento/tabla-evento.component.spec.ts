import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaEventoComponent } from './tabla-evento.component';

describe('TablaEventoComponent', () => {
  let component: TablaEventoComponent;
  let fixture: ComponentFixture<TablaEventoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TablaEventoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TablaEventoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
