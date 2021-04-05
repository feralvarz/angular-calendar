import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface ICity {
  latt_long: string;
  location_type: string;
  title: string;
  woeid: number;
}

export interface ICurrentWeather {
  title: string;
  weather: string;
  icon: string;
  alt: string;
}

export interface ILocationWeather {
  consolidated_weather: {
    weather_state_abbr: string;
    weather_state_name: string;
    [key: string]: any;
  }[];
  title: string;
  [key: string]: any;
}

@Injectable({
  providedIn: 'root',
})
export class CalendarService {
  private readonly BASE = environment.api;
  constructor(private httpClient: HttpClient) {}

  public getCities(query: string): Observable<ICity[]> {
    const url = `${this.BASE}/getCities`;
    const params = new HttpParams({
      fromString: `city=${query}`,
    });
    return this.httpClient
      .get<ICity[]>(url, { params })
      .pipe(catchError(() => of([])));
  }

  public getLocationWeather(woeid: number): Observable<ICurrentWeather> {
    const url = `${this.BASE}/getLocationWeather`;

    const params = new HttpParams({
      fromString: `woeid=${woeid}`,
    });

    return this.httpClient
      .get<ILocationWeather>(url, { params })
      .pipe(
        map((forecast) => {
          const { consolidated_weather, title, parent, time } = forecast;
          const {
            weather_state_abbr,
            weather_state_name,
            the_temp,
          } = consolidated_weather[0];

          return {
            title,
            weather: weather_state_name,
            temperature: the_temp,
            time,
            parent: parent.title,
            icon: `/assets/icons/${weather_state_abbr}.svg`,
            alt: `Icon showing weather conditions ${weather_state_name} in ${title}`,
          };
        }),
        catchError(() =>
          of({
            title: 'Location not found',
            weather: null,
            icon: null,
            alt: null,
          })
        )
      );
  }
}
