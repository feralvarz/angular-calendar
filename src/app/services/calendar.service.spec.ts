import { TestBed } from '@angular/core/testing';
import { CalendarServiceMock } from '../testing/calendar.service.mock';

import { CalendarService } from './calendar.service';

describe('CalendarService', () => {
  let service: CalendarService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: CalendarService, useClass: CalendarServiceMock }],
    });
    service = TestBed.inject(CalendarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return cities for query=san', () => {
    expect(service.getCities('san')).toEqual(CalendarServiceMock.cities);
  });

  it('should return empty array of cities for query=Disney', () => {
    const response = service.getCities('Disney');
    expect(response).toHaveSize(0);
  });
});
