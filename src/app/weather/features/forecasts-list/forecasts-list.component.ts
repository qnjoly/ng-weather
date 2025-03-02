import { AsyncPipe, DatePipe, DecimalPipe } from '@angular/common';
import { Component, inject, input, Signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { WeatherService } from '@shared/services/weather.service';

@Component({
  selector: 'app-forecasts-list',
  templateUrl: './forecasts-list.component.html',
  styleUrls: ['./forecasts-list.component.css'],
  imports: [AsyncPipe, RouterLink, DecimalPipe, DatePipe],
})
export class ForecastsListComponent {
  private readonly weatherService = inject(WeatherService);

  /**
   * The zip code give in path of the URL
   */
  protected readonly zipcode: Signal<string> = input.required<string>();

  /**
   * Observable of the zip code given in the path of the URL
   */
  private readonly zipcode$ = toObservable(this.zipcode);

  /**
   * The forecast data for the given zip code
   */
  protected readonly forecast$ = this.zipcode$.pipe(
    switchMap((zipcode: string) => this.weatherService.getForecastWithIcon(zipcode)),
  );
}
