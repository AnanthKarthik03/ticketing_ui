import { TestBed } from '@angular/core/testing';

import { ChangePassService } from './change-pass.service';

describe('ChangePassService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ChangePassService = TestBed.get(ChangePassService);
    expect(service).toBeTruthy();
  });
});
