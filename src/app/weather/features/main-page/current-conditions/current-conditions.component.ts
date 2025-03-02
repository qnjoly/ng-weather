import { DecimalPipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ConditionsAndZip } from '@weather/types/conditions-and-zip.type';

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
}
