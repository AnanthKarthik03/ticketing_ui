import { TestBed } from '@angular/core/testing';

import { LoginserService } from './login.service';

describe('LoginserService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LoginserService = TestBed.get(LoginserService);
    expect(service).toBeTruthy();
  });
});
