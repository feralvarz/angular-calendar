import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, pluck } from 'rxjs/operators';

export interface ICity {
  latt_long: string;
  location_type: string;
  title: string;
  woeid: number;
}

export interface ICurrentWeather {
  weather: string;
  icon: string;
}

@Injectable({
  providedIn: 'root',
})
export class CalendarService {
  private readonly BASE = '//www.metaweather.com/api/';
  constructor(private httpClient: HttpClient) {}

  public getCities(query: string): Observable<ICity[]> {
    const url = `${this.BASE}/location/search/`;
    const params = new HttpParams({
      fromString: `query=${query}`,
    });
    return this.httpClient.get<ICity[]>(url, { params });
  }

  public getLocationWeather(woeid: number): Observable<ICurrentWeather> {
    const url = `${this.BASE}/location/${woeid}`;

    return this.httpClient.get<any[]>(url).pipe(
      pluck('consolidated_weather'),
      map((forecast) => {
        const { weather_state_abbr, weather_state_name, ...rest } = forecast[0];

        return {
          weather: weather_state_name,
          icon: `https://www.metaweather.com/static/img/weather/png/64/${weather_state_abbr}.png`,
        };
      })
    );
  }
}
