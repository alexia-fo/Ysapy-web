import { TestBed } from '@angular/core/testing';

import { VerCalculosRendicionService } from './ver-calculos-rendicion.service';

describe('VerCalculosRendicionService', () => {
  let service: VerCalculosRendicionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VerCalculosRendicionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
