import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { CurrentConditions, CustomCurrentConditions } from '../types/current-conditions.type';
import { CustomForecast, Forecast } from '../types/forecast.type';

@Injectable()
export class WeatherService {
  private static readonly URL = environment.weather.api.url;
  private static readonly APPID = environment.weather.api.appid;
  private static readonly ICON_URL = environment.weather.icon.url;

  private readonly http: HttpClient = inject(HttpClient);

  /**
   * Here we make a request to get the current conditions data from the API. Note the use of backticks and an expression to insert the zipcode
   * @param zipcode us zip code
   */
  public getCurrentConditions(zipcode: string): Observable<CurrentConditions> {
    return this.http.get<CurrentConditions>(
      `${WeatherService.URL}/weather?zip=${zipcode},us&units=imperial&APPID=${WeatherService.APPID}`,
    );
  }

  /**
   * Here we make a request to get the forecast data from the API. Note the use of backticks and an expression to insert the zipcode
   * @param zipcode us zip code
   * @returns an observable of type Forecast
   */
  public getForecast(zipcode: string): Observable<Forecast> {
    //
    return this.http.get<Forecast>(
      `${WeatherService.URL}/forecast/daily?zip=${zipcode},us&units=imperial&cnt=5&APPID=${WeatherService.APPID}`,
    );
  }

  /**
   * This method is used to get the current conditions data with the icon url
   * @param zipcode us zip code
   * @returns an observable of type CustomCurrentConditions
   */
  public getCurrentConditionsWithIcon(zipcode: string): Observable<CustomCurrentConditions> {
    return this.getCurrentConditions(zipcode).pipe(
      map((currentConditions: CurrentConditions) => ({
        ...currentConditions,
        iconUrl: this.getWeatherIcon(currentConditions.weather[0].id),
      })),
    );
  }

  /**
   * This method is used to get the forecast data with the icon url
   * @param zipcode us zip code
   * @returns an observable of type CustomForecast
   */
  public getForecastWithIcon(zipcode: string): Observable<CustomForecast> {
    return this.getForecast(zipcode).pipe(
      map((forecast: Forecast) => ({
        ...forecast,
        list: forecast.list.map((item) => ({ ...item, iconUrl: this.getWeatherIcon(item.weather[0].id) })),
      })),
    );
  }

  /**
   * This method is used to get the weather icon based on the weather condition id
   * @param id weather condition id
   * @returns a string with the url of the icon
   */
  public getWeatherIcon(id: number): string {
    if (id >= 200 && id <= 232) return WeatherService.ICON_URL + 'art_storm.png';
    else if (id >= 501 && id <= 511) return WeatherService.ICON_URL + 'art_rain.png';
    else if (id === 500 || (id >= 520 && id <= 531)) return WeatherService.ICON_URL + 'art_light_rain.png';
    else if (id >= 600 && id <= 622) return WeatherService.ICON_URL + 'art_snow.png';
    else if (id >= 801 && id <= 804) return WeatherService.ICON_URL + 'art_clouds.png';
    else if (id === 741 || id === 761) return WeatherService.ICON_URL + 'art_fog.png';
    else return WeatherService.ICON_URL + 'art_clear.png';
  }
}
