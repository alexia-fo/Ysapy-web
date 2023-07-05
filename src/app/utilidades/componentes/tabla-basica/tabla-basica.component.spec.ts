import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaBasicaComponent } from './tabla-basica.component';

describe('TablaBasicaComponent', () => {
  let component: TablaBasicaComponent;
  let fixture: ComponentFixture<TablaBasicaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TablaBasicaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TablaBasicaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
