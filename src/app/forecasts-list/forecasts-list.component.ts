import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { WeatherService } from '../weather.service';
import { Forecast } from './forecast.type';
import { NgFor, DecimalPipe, DatePipe } from '@angular/common';

@Component({
    selector: 'app-forecasts-list',
    templateUrl: './forecasts-list.component.html',
    styleUrls: ['./forecasts-list.component.css'],
    imports: [
        NgFor,
        RouterLink,
        DecimalPipe,
        DatePipe,
    ],
})
export class ForecastsListComponent {
  zipcode: string;
  forecast: Forecast;

  constructor(
    protected weatherService: WeatherService,
    route: ActivatedRoute,
  ) {
    route.params.subscribe((params) => {
      this.zipcode = params['zipcode'];
      weatherService.getForecast(this.zipcode).subscribe((data) => (this.forecast = data));
    });
  }
}
