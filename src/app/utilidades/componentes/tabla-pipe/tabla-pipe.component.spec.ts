import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaPipeComponent } from './tabla-pipe.component';

describe('TablaPipeComponent', () => {
  let component: TablaPipeComponent;
  let fixture: ComponentFixture<TablaPipeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TablaPipeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TablaPipeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
