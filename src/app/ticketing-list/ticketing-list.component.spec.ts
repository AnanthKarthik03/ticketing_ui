import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketingListComponent } from './ticketing-list.component';

describe('TicketingListComponent', () => {
  let component: TicketingListComponent;
  let fixture: ComponentFixture<TicketingListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TicketingListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketingListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
