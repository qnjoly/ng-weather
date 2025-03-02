import { DecimalPipe, NgFor } from '@angular/common';
import { Component, inject, Signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ConditionsAndZip } from '../../../types/conditions-and-zip.type';
import { LocationWeatherService } from '../../../services/location-weather.service';

@Component({
  selector: 'app-current-conditions',
  templateUrl: './current-conditions.component.html',
  styleUrls: ['./current-conditions.component.css'],
  imports: [NgFor, RouterLink, DecimalPipe],
})
export class CurrentConditionsComponent {
  private readonly locationWeatherService = inject(LocationWeatherService);
  private readonly router = inject(Router);

  protected currentConditionsByZip: Signal<ConditionsAndZip[]> = this.locationWeatherService.getCurrentConditions;

  protected showForecast(zipcode: string) {
    this.router.navigate(['/forecast', zipcode]);
  }

  /**
   * Remove a location from the list of locations
   * @param event the event that triggered the removal
   * @param zipcode the zip code of the location to remove
   */
  protected remove(event: Event, zipcode: string): void {
    event.stopPropagation();
    this.locationWeatherService.removeLocation(zipcode);
  }
}
