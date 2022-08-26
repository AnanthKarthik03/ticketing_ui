import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketingDetailsComponent } from './ticketing-details.component';

describe('TicketingDetailsComponent', () => {
  let component: TicketingDetailsComponent;
  let fixture: ComponentFixture<TicketingDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TicketingDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketingDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
