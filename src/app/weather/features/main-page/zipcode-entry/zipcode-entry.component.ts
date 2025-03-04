import { Component, inject, output } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { LocationService } from '@shared/services/location.service';
import { LocationValidator } from '@shared/validators/location.validator';
import { WeatherService } from '@shared/services/weather.service';
import { WeatherValidator } from '@shared/validators/weather.validator';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-zipcode-entry',
  templateUrl: './zipcode-entry.component.html',
  imports: [FormsModule, ReactiveFormsModule],
})
export class ZipcodeEntryComponent {
  private readonly locationService = inject(LocationService);
  private readonly weatherService = inject(WeatherService);
  private readonly fb = inject(FormBuilder);

  /**
   * Event emitted when a zipcode is added
   */
  public readonly addZipcode = output<string>();

  /**
   * The form to add a location
   */
  protected readonly form = this.fb.group({
    zipcode: [
      '',
      [Validators.required, Validators.pattern(/^\d{5}(?:-\d{4})?$/)],
      [
        LocationValidator.checkIfLocationAlreadyRegistered(this.locationService),
        WeatherValidator.checkIfWeatherAvailable(this.weatherService),
      ],
    ],
  });

  protected submit() {
    // Only add the location if the form is valid
    if (!this.form.valid) return;
    // Add the location to the list of locations
    const { zipcode } = this.form.value;
    this.addZipcode.emit(zipcode);
  }
}
