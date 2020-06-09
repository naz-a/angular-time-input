import { TestBed } from '@angular/core/testing';

import { NgnzTimeInputService } from './ngnz-time-input.service';

describe('NgnzTimeInputService', () => {
  let service: NgnzTimeInputService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NgnzTimeInputService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
