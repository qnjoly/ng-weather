import { Component, inject } from '@angular/core';
import { LocationWeatherService } from '../../services/location-weather.service';

@Component({
  selector: 'app-zipcode-entry',
  templateUrl: './zipcode-entry.component.html',
})
export class ZipcodeEntryComponent {
  private readonly locationWeatherService = inject(LocationWeatherService);

  protected addLocation(zipcode: string) {
    this.locationWeatherService.addLocation(zipcode);
  }
}
