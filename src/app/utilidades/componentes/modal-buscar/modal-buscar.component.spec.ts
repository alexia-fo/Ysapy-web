import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalBuscarComponent } from './modal-buscar.component';

describe('ModalBuscarComponent', () => {
  let component: ModalBuscarComponent;
  let fixture: ComponentFixture<ModalBuscarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalBuscarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalBuscarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
