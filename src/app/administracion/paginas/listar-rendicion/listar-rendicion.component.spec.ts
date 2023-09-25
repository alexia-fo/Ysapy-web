import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarRendicionComponent } from './listar-rendicion.component';

describe('ListarRendicionComponent', () => {
  let component: ListarRendicionComponent;
  let fixture: ComponentFixture<ListarRendicionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListarRendicionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListarRendicionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
