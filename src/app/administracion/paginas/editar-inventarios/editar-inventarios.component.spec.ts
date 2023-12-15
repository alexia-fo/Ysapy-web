import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarInventariosComponent } from './editar-inventarios.component';

describe('EditarInventariosComponent', () => {
  let component: EditarInventariosComponent;
  let fixture: ComponentFixture<EditarInventariosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditarInventariosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditarInventariosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
