import { TestBed } from '@angular/core/testing';

import { ManejarErrorService } from './manejar-error.service';

describe('ManejarErrorService', () => {
  let service: ManejarErrorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ManejarErrorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
