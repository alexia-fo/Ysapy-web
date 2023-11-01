import { TestBed } from '@angular/core/testing';

import { ModalCloseGuard } from './modal-close.guard';

describe('ModalCloseGuard', () => {
  let guard: ModalCloseGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(ModalCloseGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
