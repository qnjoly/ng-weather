import { Component, inject, Signal } from '@angular/core';
import { ZipcodeEntryComponent } from './zipcode-entry/zipcode-entry.component';
import { CurrentConditionsComponent } from './current-conditions/current-conditions.component';
import { TabGroupComponent } from '@shared/components/tab-group/tab-group.component';
import { TabComponent } from '@shared/components/tab-group/tab/tab.component';
import { LocationWeatherService } from '@weather/services/location-weather.service';
import { ConditionsAndZip } from '@weather/types/conditions-and-zip.type';
import { LocationService } from '@shared/services/location.service';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  imports: [TabGroupComponent, TabComponent, ZipcodeEntryComponent, CurrentConditionsComponent],
})
export class MainPageComponent {
  private readonly locationService = inject(LocationService);
  private readonly locationWeatherService = inject(LocationWeatherService);

  /**
   * The current conditions for all locations
   */
  protected readonly currentConditionsByZip: Signal<ConditionsAndZip[]> =
    this.locationWeatherService.getCurrentConditions;

  /**
   * Remove a location from the list of locations
   */
  protected remove(index: number): void {
    const zip = this.currentConditionsByZip()[index].zip;
    this.locationService.removeLocation(zip);
  }
}
