import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaServersideComponent } from './tabla-serverside.component';

describe('TablaServersideComponent', () => {
  let component: TablaServersideComponent;
  let fixture: ComponentFixture<TablaServersideComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TablaServersideComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TablaServersideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
