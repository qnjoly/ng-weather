import { DecimalPipe, NgFor } from '@angular/common';
import { Component, inject, Signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ConditionsAndZip } from '../../../../conditions-and-zip.type';
import { LocationService } from '../../../../shared/services/location.service';
import { WeatherService } from '../../../../shared/services/weather.service';

@Component({
  selector: 'app-current-conditions',
  templateUrl: './current-conditions.component.html',
  styleUrls: ['./current-conditions.component.css'],
  imports: [NgFor, RouterLink, DecimalPipe],
})
export class CurrentConditionsComponent {
  private weatherService = inject(WeatherService);
  private router = inject(Router);
  protected locationService = inject(LocationService);
  protected currentConditionsByZip: Signal<ConditionsAndZip[]> = this.weatherService.getCurrentConditions();

  showForecast(zipcode: string) {
    this.router.navigate(['/forecast', zipcode]);
  }
}
