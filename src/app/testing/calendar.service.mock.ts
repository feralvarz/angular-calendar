import { Observable, of } from 'rxjs';
import { ICity, ICurrentWeather } from '../services/calendar.service';

export class CalendarServiceMock {
  static cities = require('./cities.fixture.json');
  static weather = require('./weather.fixture.json');

  // public getCities(query: string): Observable<ICity[]> {
  public getCities(query: string): ICity[] {
    const errResponse = ([] as unknown) as ICity;
    const result = query === 'san' ? CalendarServiceMock.cities : errResponse;
    return result;
  }

  public getLocationWeather(woeid: number): Observable<ICurrentWeather> {
    const result =
      woeid === 2488853
        ? CalendarServiceMock.weather
        : {
            title: 'Location not found',
            weather: null,
            icon: null,
            alt: null,
          };
    return of(result);
  }
}
