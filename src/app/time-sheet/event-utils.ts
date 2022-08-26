import { Component, OnInit } from '@angular/core';
import { EventInput } from '@fullcalendar/angular';
import { TimeSheetService } from './time-sheet.service';

let eventGuid = 0;
const TODAY_STR = new Date().toISOString().replace(/T.*$/, ''); // YYYY-MM-DD of today
// tslint:disable-next-line:prefer-const
let service: TimeSheetService;

export const INITIAL_EVENTS: EventInput[] = [
  {
    id: createEventId(),
    title: 'All-day event',
    start: TODAY_STR,
  },
  {
    id: createEventId(),
    title: 'Timed event',
    start: TODAY_STR + 'T12:00:00',
  },
];

export function createEventId() {
  service.getTimeSheet(1, 1, 1).subscribe((data) => {
    console.log(data['data']);
  });
  return String(eventGuid++);
}
