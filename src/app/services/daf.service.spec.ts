import { TestBed } from '@angular/core/testing';

import { DafService } from './daf.service';

describe('DafService', () => {
  let service: DafService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DafService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
