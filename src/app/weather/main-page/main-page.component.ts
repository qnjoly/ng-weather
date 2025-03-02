import { Component, inject, Signal } from '@angular/core';
import { LocationWeatherService } from '../services/location-weather.service';
import { ConditionsAndZip } from '../types/conditions-and-zip.type';
import { ZipcodeEntryComponent } from './zipcode-entry/zipcode-entry.component';
import { TabComponent } from '../../shared/components/tab-group/tab/tab.component';
import { TabGroupComponent } from '../../shared/components/tab-group/tab-group.component';
import { Router } from '@angular/router';
import { JsonPipe } from '@angular/common';
import { CurrentConditionsComponent } from './current-conditions/current-conditions.component';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  imports: [TabGroupComponent, TabComponent, ZipcodeEntryComponent, CurrentConditionsComponent, JsonPipe],
})
export class MainPageComponent {
  private readonly locationWeatherService = inject(LocationWeatherService);
  private readonly router = inject(Router);

  /**
   * The current conditions for all locations
   */
  protected readonly currentConditionsByZip: Signal<ConditionsAndZip[]> =
    this.locationWeatherService.getCurrentConditions;

  /**
   * Redirect to the forecast page for a location
   */
  protected showForecast(zipcode: string): void {
    this.router.navigate(['/forecast', zipcode]);
  }

  /**
   * Remove a location from the list of locations
   */
  protected remove(index: number): void {
    const zip = this.currentConditionsByZip()[index].zip;
    this.locationWeatherService.removeLocation(zip);
  }
}
