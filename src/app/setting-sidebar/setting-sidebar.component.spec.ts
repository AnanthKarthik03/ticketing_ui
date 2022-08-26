import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingSidebarComponent } from './setting-sidebar.component';

describe('SettingSidebarComponent', () => {
  let component: SettingSidebarComponent;
  let fixture: ComponentFixture<SettingSidebarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SettingSidebarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
