import { TestBed } from '@angular/core/testing';

import { ActiveStudentService } from './active-student.service';

describe('ActiveStudentService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ActiveStudentService = TestBed.get(ActiveStudentService);
    expect(service).toBeTruthy();
  });
});
