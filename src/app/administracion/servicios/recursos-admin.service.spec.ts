import { TestBed } from '@angular/core/testing';

import { RecursosAdminService } from './recursos-admin.service';

describe('RecursosAdminService', () => {
  let service: RecursosAdminService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RecursosAdminService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
