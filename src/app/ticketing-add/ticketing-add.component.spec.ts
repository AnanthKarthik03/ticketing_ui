import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketingAddComponent } from './ticketing-add.component';

describe('TicketingAddComponent', () => {
  let component: TicketingAddComponent;
  let fixture: ComponentFixture<TicketingAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TicketingAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketingAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
