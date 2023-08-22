import { TestBed } from '@angular/core/testing';

import { JspdfAutotableService } from './jspdf-autotable.service';

describe('JspdfAutotableService', () => {
  let service: JspdfAutotableService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JspdfAutotableService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
