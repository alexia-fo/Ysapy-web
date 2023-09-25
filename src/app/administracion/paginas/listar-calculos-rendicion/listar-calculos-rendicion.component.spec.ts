import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarCalculosRendicionComponent } from './listar-calculos-rendicion.component';

describe('ListarCalculosRendicionComponent', () => {
  let component: ListarCalculosRendicionComponent;
  let fixture: ComponentFixture<ListarCalculosRendicionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListarCalculosRendicionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListarCalculosRendicionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
