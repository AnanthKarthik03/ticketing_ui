import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerSidebarComponent } from './customer-sidebar.component';

describe('CustomerSidebarComponent', () => {
  let component: CustomerSidebarComponent;
  let fixture: ComponentFixture<CustomerSidebarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerSidebarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
