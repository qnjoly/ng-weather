import { DecimalPipe } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ConditionsAndZip } from '../../types/conditions-and-zip.type';

@Component({
  selector: 'app-current-conditions',
  templateUrl: './current-conditions.component.html',
  styleUrls: ['./current-conditions.component.css'],
  imports: [RouterLink, DecimalPipe],
})
export class CurrentConditionsComponent {
  /**
   * Current conditions to display for a location
   */
  public readonly currentConditionByZip = input.required<ConditionsAndZip>();

  /**
   * Emit an event to show the forecast for a location
   */
  public readonly showForecast = output<string>();

  /**
   * Show the forecast for a location
   * @param zipcode the zip code of the location to show the forecast for
   */
  protected show(zipcode: string): void {
    this.showForecast.emit(zipcode);
  }
}
