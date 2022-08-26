import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectEmployeesComponent } from './project-employees.component';

describe('ProjectEmployeesComponent', () => {
  let component: ProjectEmployeesComponent;
  let fixture: ComponentFixture<ProjectEmployeesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectEmployeesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectEmployeesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
