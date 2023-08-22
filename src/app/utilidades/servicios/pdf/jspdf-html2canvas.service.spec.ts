import { TestBed } from '@angular/core/testing';

import { JspdfHtml2canvasService } from './jspdf-html2canvas.service';

describe('JspdfHtml2canvasService', () => {
  let service: JspdfHtml2canvasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JspdfHtml2canvasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
