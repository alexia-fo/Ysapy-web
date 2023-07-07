import { TestBed } from '@angular/core/testing';

import { InvRendService } from './inv-rend.service';

describe('InvRendService', () => {
  let service: InvRendService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InvRendService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
