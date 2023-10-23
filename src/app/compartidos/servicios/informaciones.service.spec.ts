import { TestBed } from '@angular/core/testing';

import { InformacionesService } from './informaciones.service';

describe('InformacionesService', () => {
  let service: InformacionesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InformacionesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
