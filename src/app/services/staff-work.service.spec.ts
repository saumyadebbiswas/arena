import { TestBed } from '@angular/core/testing';

import { StaffWorkService } from './staff-work.service';

describe('StaffWorkService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: StaffWorkService = TestBed.get(StaffWorkService);
    expect(service).toBeTruthy();
  });
});
