import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeesGroupComponent } from './employees-group.component';

describe('EmployeesGroupComponent', () => {
  let component: EmployeesGroupComponent;
  let fixture: ComponentFixture<EmployeesGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployeesGroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeesGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
